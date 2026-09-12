import { IIndustrialProtocolAdapter } from "./protocolAdapter.interface.js";

export class ModbusAdapter implements IIndustrialProtocolAdapter {
  name = "Modbus TCP Gateway Adapter";
  protocol = "MODBUS" as const;
  private host: string;
  private port: number;
  private connected = false;
  private dataCallback?: (rawPayload: any) => void;

  constructor(host = "192.168.2.50", port = 502) {
    this.host = host;
    this.port = port;
  }

  async connect(): Promise<void> {
    this.connected = true;
    console.log(`[Modbus Adapter] Connected to Modbus-TCP slave at ${this.host}:${this.port}`);
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    console.log(`[Modbus Adapter] Disconnected from ${this.host}:${this.port}`);
  }

  onData(callback: (rawPayload: any) => void): void {
    this.dataCallback = callback;
  }

  handleRegisters(unitId: number, registers: Record<number, number>, assetCode = "CP-002") {
    if (this.dataCallback) {
      this.dataCallback({
        protocol: "MODBUS",
        host: `${this.host}:${this.port}`,
        unitId,
        registers,
        assetCode,
        timestamp: new Date().toISOString(),
      });
    }
  }

  getStatus() {
    return {
      connected: this.connected,
      endpoint: `tcp://${this.host}:${this.port}`,
      nodesCount: 64,
      lastPing: new Date().toISOString(),
    };
  }
}
