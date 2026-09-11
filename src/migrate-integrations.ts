import { pool } from "./config/database.js";

async function migrateIntegrations() {
  console.log("=== [MIGRATION] Starting Third-Party Integrations Database Migration ===");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Subscriptions Table
    console.log("Creating 'subscriptions' table if not exists...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        plan_id VARCHAR(100) NOT NULL,
        plan_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
        billing_cycle VARCHAR(50) NOT NULL DEFAULT 'MONTHLY',
        amount NUMERIC(12, 2) NOT NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'INR',
        current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
        razorpay_subscription_id VARCHAR(100),
        razorpay_customer_id VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant ON subscriptions(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
    `);

    // 2. Payments Table
    console.log("Creating 'payments' table if not exists...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
        order_id VARCHAR(100) NOT NULL,
        payment_id VARCHAR(100),
        amount NUMERIC(12, 2) NOT NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'INR',
        status VARCHAR(50) NOT NULL DEFAULT 'CREATED',
        method VARCHAR(50),
        receipt_number VARCHAR(100),
        razorpay_signature VARCHAR(255),
        notes JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
      CREATE INDEX IF NOT EXISTS idx_payments_tenant ON payments(tenant_id);
    `);

    // 3. Payment Webhooks Table (Idempotency & Audit)
    console.log("Creating 'payment_webhooks' table if not exists...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_webhooks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id VARCHAR(150) NOT NULL UNIQUE,
        event_type VARCHAR(100) NOT NULL,
        payload JSONB NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'PROCESSED',
        error TEXT,
        processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_webhooks_event_id ON payment_webhooks(event_id);
    `);

    // 4. Machine Telemetry Table
    console.log("Creating 'machine_telemetry' table if not exists...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS machine_telemetry (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        plant_id VARCHAR(100) NOT NULL DEFAULT 'PLT-01',
        asset_id VARCHAR(100) NOT NULL,
        asset_code VARCHAR(100) NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        status VARCHAR(50) NOT NULL DEFAULT 'RUNNING',
        production_count INTEGER NOT NULL DEFAULT 0,
        speed NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
        cycle_time NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
        downtime INTEGER NOT NULL DEFAULT 0,
        vibration NUMERIC(8, 3) DEFAULT 0.000,
        temperature NUMERIC(8, 2) DEFAULT 0.00,
        pressure NUMERIC(8, 2) DEFAULT 0.00,
        rpm INTEGER DEFAULT 0,
        power_kw NUMERIC(8, 2) DEFAULT 0.00,
        flow_rate NUMERIC(10, 2) DEFAULT 0.00,
        fault_code VARCHAR(100),
        alarm TEXT,
        source VARCHAR(50) NOT NULL DEFAULT 'SIMULATOR',
        raw_payload JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_telemetry_asset_time ON machine_telemetry(asset_code, timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_telemetry_plant ON machine_telemetry(plant_id);
    `);

    // 5. IoT Gateways Table
    console.log("Creating 'iot_gateways' table if not exists...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS iot_gateways (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        protocol VARCHAR(100) NOT NULL,
        endpoint_url VARCHAR(255),
        connected_nodes INTEGER NOT NULL DEFAULT 0,
        telemetry_rate VARCHAR(50) NOT NULL DEFAULT '10 Hz',
        status VARCHAR(50) NOT NULL DEFAULT 'Connected',
        last_ping_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    // Seed default gateways if table empty
    const { rows: gwRows } = await client.query(`SELECT count(*) FROM iot_gateways`);
    if (parseInt(gwRows[0].count, 10) === 0) {
      console.log("Seeding default industrial IoT gateways...");
      await client.query(`
        INSERT INTO iot_gateways (id, name, protocol, endpoint_url, connected_nodes, telemetry_rate, status)
        VALUES
          ('IOT-01', 'Plant 1 OPC-UA Industrial Edge Server', 'OPC-UA (TCP:4840)', 'opc.tcp://192.168.1.100:4840', 142, '100 Hz', 'Connected'),
          ('IOT-02', 'Plant 1 MQTT Sensor Broker', 'MQTT (TLS:8883)', 'mqtts://broker.flowstate.internal:8883', 86, '10 Hz', 'Connected'),
          ('IOT-03', 'Plant 2 Modbus-TCP Gateway', 'Modbus TCP (Port 502)', 'tcp://192.168.2.50:502', 64, '1 Hz', 'Connected')
        ON CONFLICT (id) DO NOTHING;
      `);
    }

    await client.query("COMMIT");
    console.log("=== [MIGRATION] Migration successfully committed! ===");
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("=== [MIGRATION ERROR] Migration failed, transaction rolled back ===", err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrateIntegrations().catch((err) => {
  console.error("Migration execution failed:", err);
  process.exit(1);
});
