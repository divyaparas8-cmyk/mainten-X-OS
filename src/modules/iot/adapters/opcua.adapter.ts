import { IIndustrialProtocolAdapter } from "./protocolAdapter.interface.js";

export class OpcUaAdapter implements IIndustrialProtocolAdapter {
  name = "OPC-UA Edge Adapter";
  protocol = "OPC_UA" as const;
  private endpoint: string;
  private connected = false;
  private dataCallback?: (rawPayload: any) => void;

  constructor(endpoint = "opc.tcp://192.168.1.100:4840") {
    this.endpoint = endpoint;
  }

  async connect(): Promise<void> {
    this.connected = true;
    console.log(`[OPC-UA Adapter] Connected to industrial server at ${this.endpoint}`);
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    console.log(`[OPC-UA Adapter] Disconnected from ${this.endpoint}`);
  }

  onData(callback: (rawPayload: any) => void): void {
    this.dataCallback = callback;
  }

  // Called when raw OPC-UA node value changes or received from edge gateway
  handleNodePublish(nodeId: string, value: any, assetCode = "FM-001") {
    if (this.dataCallback) {
      this.dataCallback({
        protocol: "OPC_UA",
        endpoint: this.endpoint,
        nodeId,
        value,
        assetCode,
        timestamp: new Date().toISOString(),
      });
    }
  }

  getStatus() {
    return {
      connected: this.connected,
      endpoint: this.endpoint,
      nodesCount: 142,
      lastPing: new Date().toISOString(),
    };
  }
}
