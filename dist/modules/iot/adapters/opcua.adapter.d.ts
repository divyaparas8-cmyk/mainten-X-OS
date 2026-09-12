import { IIndustrialProtocolAdapter } from "./protocolAdapter.interface.js";
export declare class OpcUaAdapter implements IIndustrialProtocolAdapter {
    name: string;
    protocol: "OPC_UA";
    private endpoint;
    private connected;
    private dataCallback?;
    constructor(endpoint?: string);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    onData(callback: (rawPayload: any) => void): void;
    handleNodePublish(nodeId: string, value: any, assetCode?: string): void;
    getStatus(): {
        connected: boolean;
        endpoint: string;
        nodesCount: number;
        lastPing: string;
    };
}
//# sourceMappingURL=opcua.adapter.d.ts.map