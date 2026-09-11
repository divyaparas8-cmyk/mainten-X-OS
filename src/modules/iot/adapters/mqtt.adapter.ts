import { IIndustrialProtocolAdapter } from "./protocolAdapter.interface.js";

export class MqttAdapter implements IIndustrialProtocolAdapter {
  name = "MQTT Industrial Broker Adapter";
  protocol = "MQTT" as const;
  private brokerUrl: string;
  private connected = false;
  private dataCallback?: (rawPayload: any) => void;

  constructor(brokerUrl = "mqtts://broker.flowstate.internal:8883") {
    this.brokerUrl = brokerUrl;
  }

  async connect(): Promise<void> {
    this.connected = true;
    console.log(`[MQTT Adapter] Subscribed to telemetry topics on ${this.brokerUrl}`);
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    console.log(`[MQTT Adapter] Disconnected from ${this.brokerUrl}`);
  }

  onData(callback: (rawPayload: any) => void): void {
    this.dataCallback = callback;
  }

  handleMessage(topic: string, messageJson: any) {
    if (this.dataCallback) {
      this.dataCallback({
        protocol: "MQTT",
        broker: this.brokerUrl,
        topic,
        payload: messageJson,
        timestamp: new Date().toISOString(),
      });
    }
  }

  getStatus() {
    return {
      connected: this.connected,
      endpoint: this.brokerUrl,
      nodesCount: 86,
      lastPing: new Date().toISOString(),
    };
  }
}
