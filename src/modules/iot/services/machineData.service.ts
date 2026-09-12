import { db } from "../../../config/database.js";
import { machineTelemetry, iotGateways } from "../../../db/schema/index.js";
import { eq, desc } from "drizzle-orm";
import { TelemetryNormalizer, NormalizedMachineEvent } from "../normalizers/telemetryNormalizer.js";
import { OpcUaAdapter } from "../adapters/opcua.adapter.js";
import { MqttAdapter } from "../adapters/mqtt.adapter.js";
import { ModbusAdapter } from "../adapters/modbus.adapter.js";
import { SimulatorAdapter } from "../adapters/simulator.adapter.js";
import { FastifyReply } from "fastify";

export class MachineDataService {
  private opcuaAdapter: OpcUaAdapter;
  private mqttAdapter: MqttAdapter;
  private modbusAdapter: ModbusAdapter;
  private simulatorAdapter: SimulatorAdapter;

  private latestTelemetryByAsset: Map<string, NormalizedMachineEvent> = new Map();
  private sseSubscribers: Set<FastifyReply> = new Set();
  private isSimulatorRunning = false;

  constructor() {
    this.opcuaAdapter = new OpcUaAdapter();
    this.mqttAdapter = new MqttAdapter();
    this.modbusAdapter = new ModbusAdapter();
    this.simulatorAdapter = new SimulatorAdapter(Number(process.env.IOT_SIMULATOR_INTERVAL_MS) || 3000);

    // Register adapter callbacks to normalization pipeline
    this.opcuaAdapter.onData((payload) => this.ingest(payload));
    this.mqttAdapter.onData((payload) => this.ingest(payload));
    this.modbusAdapter.onData((payload) => this.ingest(payload));
    this.simulatorAdapter.onData((payload) => this.ingest(payload));

    // Seed initial cache with baseline nominal data
    this.seedInitialCache();

    // Auto-start simulator if enabled in env
    if (process.env.IOT_SIMULATOR_ENABLED !== "false") {
      this.startSimulator().catch((e) => console.warn("Failed to auto-start simulator:", e.message));
    }
  }

  private seedInitialCache() {
    const defaultFM001: NormalizedMachineEvent = {
      assetId: "FM-001",
      assetCode: "FM-001",
      plantId: "PLT-01",
      timestamp: new Date().toISOString(),
      status: "RUNNING",
      productionCount: 32450,
      speed: 250,
      cycleTime: 0.24,
      downtime: 0,
      vibration: 2.1,
      temperature: 62.4,
      pressure: 6.2,
      rpm: 1200,
      powerKw: 45.2,
      flowRate: 9400,
      source: "SIMULATOR",
    };
    this.latestTelemetryByAsset.set("FM-001", defaultFM001);
  }

  async ingest(rawPayload: any): Promise<NormalizedMachineEvent> {
    const event = TelemetryNormalizer.normalize(rawPayload);

    // 1. Threshold checks & automatic anomaly flagging
    if (event.vibration > 3.0) {
      event.alarm = `HIGH VIBRATION ALERT: ${event.vibration} mm/s exceeds 3.0 mm/s limit on ${event.assetCode}`;
    }
    if (event.temperature > 75.0) {
      event.alarm = `HIGH TEMPERATURE ALERT: ${event.temperature}°C exceeds 75°C limit on ${event.assetCode}`;
    }

    // 2. Cache latest event in-memory for zero-latency retrieval
    this.latestTelemetryByAsset.set(event.assetCode, event);

    // 3. Asynchronously persist into PostgreSQL machine_telemetry table
    db.insert(machineTelemetry)
      .values({
        assetId: event.assetId,
        assetCode: event.assetCode,
        plantId: event.plantId,
        timestamp: new Date(event.timestamp),
        status: event.status,
        productionCount: event.productionCount,
        speed: String(event.speed),
        cycleTime: String(event.cycleTime),
        downtime: event.downtime,
        vibration: String(event.vibration),
        temperature: String(event.temperature),
        pressure: String(event.pressure),
        rpm: event.rpm || 0,
        powerKw: event.powerKw ? String(event.powerKw) : "0.00",
        flowRate: event.flowRate ? String(event.flowRate) : "0.00",
        faultCode: event.faultCode,
        alarm: event.alarm,
        source: event.source,
        rawPayload: event.rawPayload,
      })
      .catch((err) => {
        // Log without crashing ingestion pipeline
        console.warn("[MachineDataService DB Ingest Warning]:", err.message);
      });

    // 4. Broadcast to active SSE real-time subscribers
    this.broadcastEvent(event);

    return event;
  }

  getLatestTelemetry(assetCode?: string) {
    if (assetCode && this.latestTelemetryByAsset.has(assetCode)) {
      return this.latestTelemetryByAsset.get(assetCode);
    }
    // Return all latest telemetry snapshots or default primary asset
    return Array.from(this.latestTelemetryByAsset.values());
  }

  async getHistory(assetCode: string, limit = 50) {
    try {
      const records = await db
        .select()
        .from(machineTelemetry)
        .where(eq(machineTelemetry.assetCode, assetCode))
        .orderBy(desc(machineTelemetry.timestamp))
        .limit(limit);

      return records;
    } catch (err: any) {
      console.warn("Failed to read telemetry history:", err.message);
      // Fallback from cache
      const latest = this.latestTelemetryByAsset.get(assetCode);
      return latest ? [latest] : [];
    }
  }

  // --- Real-time SSE Live Streaming ---
  addSseSubscriber(reply: FastifyReply) {
    this.sseSubscribers.add(reply);

    // Send immediate snapshot of latest telemetry
    const snapshot = Array.from(this.latestTelemetryByAsset.values());
    reply.raw.write(`data: ${JSON.stringify({ type: "SNAPSHOT", data: snapshot })}\n\n`);

    reply.raw.on("close", () => {
      this.sseSubscribers.delete(reply);
    });
  }

  private broadcastEvent(event: NormalizedMachineEvent) {
    if (this.sseSubscribers.size === 0) return;

    const message = `data: ${JSON.stringify({ type: "TELEMETRY_UPDATE", data: event })}\n\n`;
    for (const sub of this.sseSubscribers) {
      try {
        sub.raw.write(message);
      } catch {
        this.sseSubscribers.delete(sub);
      }
    }
  }

  // --- Simulator Controls ---
  async startSimulator(): Promise<{ status: string; message: string }> {
    if (!this.isSimulatorRunning) {
      await this.simulatorAdapter.connect();
      this.isSimulatorRunning = true;
    }
    return { status: "RUNNING", message: "Synthetic telemetry simulator active." };
  }

  async stopSimulator(): Promise<{ status: string; message: string }> {
    if (this.isSimulatorRunning) {
      await this.simulatorAdapter.disconnect();
      this.isSimulatorRunning = false;
    }
    return { status: "STOPPED", message: "Synthetic telemetry simulator stopped." };
  }

  getSimulatorStatus() {
    return {
      running: this.isSimulatorRunning,
      adapterStatus: this.simulatorAdapter.getStatus(),
    };
  }

  // --- Industrial Gateways & Edge Nodes Management ---
  async listGateways() {
    try {
      const records = await db.select().from(iotGateways);
      if (records.length > 0) return records;
    } catch (err: any) {
      console.warn("Could not load gateways from DB:", err.message);
    }

    // Default static fallback
    return [
      { id: "IOT-01", name: "Plant 1 OPC-UA Industrial Edge Server", protocol: "OPC-UA (TCP:4840)", connectedNodes: 142, telemetryRate: "100 Hz", status: "Connected" },
      { id: "IOT-02", name: "Plant 1 MQTT Sensor Broker", protocol: "MQTT (TLS:8883)", connectedNodes: 86, telemetryRate: "10 Hz", status: "Connected" },
      { id: "IOT-03", name: "Plant 2 Modbus-TCP Gateway", protocol: "Modbus TCP (Port 502)", connectedNodes: 64, telemetryRate: "1 Hz", status: "Connected" }
    ];
  }

  // Expose underlying adapters for direct protocol triggers in tests
  getAdapters() {
    return {
      opcua: this.opcuaAdapter,
      mqtt: this.mqttAdapter,
      modbus: this.modbusAdapter,
      simulator: this.simulatorAdapter,
    };
  }
}

export const machineDataService = new MachineDataService();
