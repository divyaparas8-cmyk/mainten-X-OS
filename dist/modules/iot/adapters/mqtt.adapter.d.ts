import { IIndustrialProtocolAdapter } from "./protocolAdapter.interface.js";
export declare class MqttAdapter implements IIndustrialProtocolAdapter {
    name: string;
    protocol: "MQTT";
    private brokerUrl;
    private connected;
    private dataCallback?;
    constructor(brokerUrl?: string);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    onData(callback: (rawPayload: any) => void): void;
    handleMessage(topic: string, messageJson: any): void;
    getStatus(): {
        connected: boolean;
        endpoint: string;
        nodesCount: number;
        lastPing: string;
    };
}
//# sourceMappingURL=mqtt.adapter.d.ts.map