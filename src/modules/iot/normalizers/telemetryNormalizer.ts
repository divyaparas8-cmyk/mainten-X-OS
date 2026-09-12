export interface NormalizedMachineEvent {
  assetId: string;
  assetCode: string;
  plantId: string;
  timestamp: string; // ISO 8601
  status: "RUNNING" | "STOPPED" | "IDLE" | "MAINTENANCE";
  productionCount: number;
  speed: number;       // units/min or bpm
  cycleTime: number;   // seconds
  downtime: number;    // minutes
  vibration: number;   // mm/s RMS
  temperature: number; // °C
  pressure: number;    // Bar
  rpm?: number;
  powerKw?: number;
  flowRate?: number;
  faultCode?: string;
  alarm?: string;
  source: "OPC_UA" | "MQTT" | "MODBUS" | "SIMULATOR";
  rawPayload?: Record<string, any>;
}

export class TelemetryNormalizer {
  static normalize(raw: any): NormalizedMachineEvent {
    // 1. Direct normalized event / simulator
    if (raw.assetCode && raw.vibration !== undefined && raw.source) {
      return {
        assetId: String(raw.assetId || raw.assetCode),
        assetCode: String(raw.assetCode),
        plantId: String(raw.plantId || "PLT-01"),
        timestamp: raw.timestamp ? new Date(raw.timestamp).toISOString() : new Date().toISOString(),
        status: (["RUNNING", "STOPPED", "IDLE", "MAINTENANCE"].includes(raw.status) ? raw.status : "RUNNING") as any,
        productionCount: Number(raw.productionCount || 0),
        speed: Number(raw.speed || 0),
        cycleTime: Number(raw.cycleTime || 0),
        downtime: Number(raw.downtime || 0),
        vibration: Number(raw.vibration || 0),
        temperature: Number(raw.temperature || 0),
        pressure: Number(raw.pressure || 0),
        rpm: raw.rpm !== undefined ? Number(raw.rpm) : undefined,
        powerKw: raw.powerKw !== undefined ? Number(raw.powerKw) : undefined,
        flowRate: raw.flowRate !== undefined ? Number(raw.flowRate) : undefined,
        faultCode: raw.faultCode ? String(raw.faultCode) : undefined,
        alarm: raw.alarm ? String(raw.alarm) : undefined,
        source: raw.source || "SIMULATOR",
        rawPayload: raw,
      };
    }

    // 2. OPC-UA Node Packet Normalization
    if (raw.protocol === "OPC_UA") {
      const assetCode = raw.assetCode || "FM-001";
      const val = typeof raw.value === "object" ? raw.value : { metric: raw.value };
      return {
        assetId: assetCode,
        assetCode,
        plantId: "PLT-01",
        timestamp: raw.timestamp || new Date().toISOString(),
        status: val.status || "RUNNING",
        productionCount: Number(val.productionCount || 0),
        speed: Number(val.speed || (raw.nodeId?.includes("Speed") ? raw.value : 250)),
        cycleTime: Number(val.cycleTime || 0.24),
        downtime: Number(val.downtime || 0),
        vibration: Number(val.vibration || (raw.nodeId?.includes("Vibration") ? raw.value : 2.1)),
        temperature: Number(val.temperature || (raw.nodeId?.includes("Temp") ? raw.value : 62.4)),
        pressure: Number(val.pressure || (raw.nodeId?.includes("Pressure") ? raw.value : 6.2)),
        source: "OPC_UA",
        rawPayload: raw,
      };
    }

    // 3. MQTT Sparkplug B / Topic Payload Normalization
    if (raw.protocol === "MQTT" || raw.topic) {
      const p = raw.payload || {};
      const assetCode = p.assetCode || p.device || "FM-001";
      return {
        assetId: assetCode,
        assetCode,
        plantId: p.plantId || "PLT-01",
        timestamp: raw.timestamp || new Date().toISOString(),
        status: p.status || "RUNNING",
        productionCount: Number(p.count || p.productionCount || 0),
        speed: Number(p.speed || p.bph || 250),
        cycleTime: Number(p.cycleTime || 0.24),
        downtime: Number(p.downtime || 0),
        vibration: Number(p.vibration || p.vib || 2.1),
        temperature: Number(p.temperature || p.temp || 62.4),
        pressure: Number(p.pressure || p.press || 6.2),
        faultCode: p.faultCode,
        alarm: p.alarm,
        source: "MQTT",
        rawPayload: raw,
      };
    }

    // 4. Modbus-TCP Register Normalization
    if (raw.protocol === "MODBUS" || raw.registers) {
      const regs = raw.registers || {};
      const assetCode = raw.assetCode || "CP-002";
      // Holding registers map: 40001=speed, 40002=temp*10, 40003=press*10, 40004=vib*100
      const speed = regs[40001] || 250;
      const temperature = regs[40002] ? regs[40002] / 10 : 64.1;
      const pressure = regs[40003] ? regs[40003] / 10 : 5.8;
      const vibration = regs[40004] ? regs[40004] / 100 : 2.85;

      return {
        assetId: assetCode,
        assetCode,
        plantId: "PLT-01",
        timestamp: raw.timestamp || new Date().toISOString(),
        status: regs[40000] === 0 ? "STOPPED" : "RUNNING",
        productionCount: regs[40005] || 32442,
        speed,
        cycleTime: Math.round((60 / (speed || 1)) * 100) / 100,
        downtime: 0,
        vibration,
        temperature,
        pressure,
        source: "MODBUS",
        rawPayload: raw,
      };
    }

    // Default Fallback
    const fallbackCode = raw.assetCode || raw.assetId || "FM-001";
    return {
      assetId: fallbackCode,
      assetCode: fallbackCode,
      plantId: "PLT-01",
      timestamp: new Date().toISOString(),
      status: "RUNNING",
      productionCount: Number(raw.productionCount || 0),
      speed: Number(raw.speed || 250),
      cycleTime: 0.24,
      downtime: 0,
      vibration: Number(raw.vibration || 2.1),
      temperature: Number(raw.temperature || 62.4),
      pressure: Number(raw.pressure || 6.2),
      source: "SIMULATOR",
      rawPayload: raw,
    };
  }
}
