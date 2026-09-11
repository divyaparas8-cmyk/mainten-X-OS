export type IndustrialProtocol = "OPC_UA" | "MQTT" | "MODBUS" | "SIMULATOR";

export interface IIndustrialProtocolAdapter {
  name: string;
  protocol: IndustrialProtocol;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  onData(callback: (rawPayload: any) => void): void;
  getStatus(): {
    connected: boolean;
    endpoint?: string;
    nodesCount?: number;
    lastPing?: string;
  };
}
