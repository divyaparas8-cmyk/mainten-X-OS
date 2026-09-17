const { Client } = require('pg');

async function setup() {
  const client = new Client({ connectionString: 'postgres://postgres:root@localhost:5432/maintenxos' });
  await client.connect();
  console.log('Connected to PostgreSQL database maintenxos');

  // 1. ERP CONNECTOR CONFIG & SYNC EVENTS
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.erp_connector_config (
      id VARCHAR(100) PRIMARY KEY DEFAULT 'SAP_S4HANA',
      tenant_id UUID,
      system_type VARCHAR(100) DEFAULT 'SAP S/4HANA',
      gateway_endpoint VARCHAR(255) DEFAULT 'sap-prod-gw.corp.flowstate.io:3300',
      client_system VARCHAR(100) DEFAULT 'PRD_100 • S4H_CORP',
      auth_mode VARCHAR(100) DEFAULT 'OAuth2 mTLS Certificate',
      status VARCHAR(50) DEFAULT 'Connected',
      sync_frequency VARCHAR(50) DEFAULT '15 Mins',
      sync_status VARCHAR(100) DEFAULT 'Synchronized (Last: 2 mins ago)',
      connector_health VARCHAR(50) DEFAULT '100%',
      error_queue VARCHAR(50) DEFAULT '0 Errors',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await client.query(`
    INSERT INTO public.erp_connector_config (id, system_type, gateway_endpoint, client_system, auth_mode, status, sync_frequency, sync_status, connector_health, error_queue)
    VALUES ('SAP_S4HANA', 'SAP S/4HANA', 'sap-prod-gw.corp.flowstate.io:3300', 'PRD_100 • S4H_CORP', 'OAuth2 mTLS Certificate', 'Connected', '15 Mins', 'Synchronized (Last: 2 mins ago)', '100%', '0 Errors')
    ON CONFLICT (id) DO NOTHING;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS public.erp_sync_events (
      id VARCHAR(100) PRIMARY KEY,
      tenant_id UUID,
      time VARCHAR(100) NOT NULL,
      event_type VARCHAR(100) NOT NULL,
      entity_scope VARCHAR(255) NOT NULL,
      records_processed VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Success',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Seed baseline ERP events if empty
  const erpCount = await client.query('SELECT count(*) FROM public.erp_sync_events');
  if (parseInt(erpCount.rows[0].count) === 0) {
    await client.query(`
      INSERT INTO public.erp_sync_events (id, time, event_type, entity_scope, records_processed, status, created_at, updated_at) VALUES
      ('ERP-EVT-01', '2 mins ago', 'Delta Sync', 'Purchase Orders, Inventory', '142', 'Success', NOW() - INTERVAL '2 minutes', NOW()),
      ('ERP-EVT-02', '17 mins ago', 'Delta Sync', 'Production Orders', '38', 'Success', NOW() - INTERVAL '17 minutes', NOW()),
      ('ERP-EVT-03', '32 mins ago', 'Delta Sync', 'Master Data (SKUs)', '14', 'Success', NOW() - INTERVAL '32 minutes', NOW()),
      ('ERP-EVT-04', '47 mins ago', 'Delta Sync', 'Purchase Orders, Inventory', '129', 'Success', NOW() - INTERVAL '47 minutes', NOW()),
      ('ERP-EVT-05', '1 hour ago', 'Full Master Sync', 'All ERP Entities', '4,592', 'Success', NOW() - INTERVAL '1 hour', NOW());
    `);
    console.log('Seeded baseline ERP sync events');
  }

  // 2. IOT GATEWAYS
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.iot_gateways (
      id VARCHAR(100) PRIMARY KEY,
      tenant_id UUID,
      name VARCHAR(255) NOT NULL,
      protocol VARCHAR(100) NOT NULL,
      endpoint_url VARCHAR(255),
      connected_nodes INTEGER DEFAULT 0 NOT NULL,
      telemetry_rate VARCHAR(50) DEFAULT '10 Hz' NOT NULL,
      status VARCHAR(50) DEFAULT 'Connected' NOT NULL,
      last_ping_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
  `);

  const iotCount = await client.query('SELECT count(*) FROM public.iot_gateways');
  if (parseInt(iotCount.rows[0].count) === 0) {
    await client.query(`
      INSERT INTO public.iot_gateways (id, name, protocol, endpoint_url, connected_nodes, telemetry_rate, status, last_ping_at, created_at, updated_at) VALUES
      ('IOT-01', 'Plant 1 OPC-UA Industrial Edge Server', 'OPC-UA (TCP:4840)', 'opc.tcp://192.168.1.50:4840', 142, '100 Hz', 'Connected', NOW(), NOW(), NOW()),
      ('IOT-02', 'Plant 1 MQTT Sensor Broker', 'MQTT (TLS:8883)', 'mqtts://broker.internal.flowstate.io:8883', 86, '10 Hz', 'Connected', NOW(), NOW(), NOW()),
      ('IOT-03', 'Plant 2 Modbus-TCP Gateway', 'Modbus TCP (Port 502)', 'tcp://192.168.2.100:502', 64, '1 Hz', 'Connected', NOW(), NOW(), NOW());
    `);
    console.log('Seeded baseline IoT gateways');
  }

  // 3. BARCODE SYMBOLOGIES / FORMATS
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.barcode_formats (
      id VARCHAR(100) PRIMARY KEY,
      tenant_id UUID,
      standard VARCHAR(255) NOT NULL,
      use_case VARCHAR(255) NOT NULL,
      ai_app_prefix VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'Active' NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
  `);

  const bcCount = await client.query('SELECT count(*) FROM public.barcode_formats');
  if (parseInt(bcCount.rows[0].count) === 0) {
    await client.query(`
      INSERT INTO public.barcode_formats (id, standard, use_case, ai_app_prefix, status, created_at, updated_at) VALUES
      ('BC-01', 'GS1-128 (UCC/EAN-128)', 'Secondary Case & Pallet Logistics', '(01) GTIN, (10) Batch Lot, (17) Expiry', 'Active', NOW(), NOW()),
      ('BC-02', '2D DataMatrix (ISO/IEC 16022)', 'Primary Direct Bottle Serialization', 'High-density micro barcode', 'Active', NOW(), NOW()),
      ('BC-03', 'QR Code (ISO/IEC 18004)', 'Maintenance Asset Tagging & SOP Links', 'URL Deep Linking', 'Active', NOW(), NOW());
    `);
    console.log('Seeded baseline barcode formats');
  }

  // 4. REST API KEYS
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.api_keys (
      id VARCHAR(100) PRIMARY KEY,
      tenant_id UUID,
      name VARCHAR(255) NOT NULL,
      key_masked VARCHAR(255) NOT NULL,
      key_hash VARCHAR(255),
      rate_limit VARCHAR(100) DEFAULT '500 req/min' NOT NULL,
      status VARCHAR(50) DEFAULT 'Active' NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
  `);

  const keyCount = await client.query('SELECT count(*) FROM public.api_keys');
  if (parseInt(keyCount.rows[0].count) === 0) {
    await client.query(`
      INSERT INTO public.api_keys (id, name, key_masked, key_hash, rate_limit, status, created_at, updated_at) VALUES
      ('KEY-01', 'SCADA Production Telemetry Ingest', 'mfg_live_9482••••••••••••••••', 'hash_scada_live_9482', '1,000 req/min', 'Active', NOW() - INTERVAL '30 days', NOW()),
      ('KEY-02', 'Warehouse WMS Pallet Sync', 'wms_live_7104••••••••••••••••', 'hash_wms_live_7104', '250 req/min', 'Active', NOW() - INTERVAL '25 days', NOW());
    `);
    console.log('Seeded baseline API keys');
  }

  console.log('All 4 Integrations tables created and verified successfully!');
  await client.end();
}

setup().catch(console.error);
