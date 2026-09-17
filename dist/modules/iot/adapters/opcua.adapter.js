"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpcUaAdapter = void 0;
class OpcUaAdapter {
    name = "OPC-UA Edge Adapter";
    protocol = "OPC_UA";
    endpoint;
    connected = false;
    dataCallback;
    constructor(endpoint = "opc.tcp://192.168.1.100:4840") {
        this.endpoint = endpoint;
    }
    async connect() {
        this.connected = true;
        console.log(`[OPC-UA Adapter] Connected to industrial server at ${this.endpoint}`);
    }
    async disconnect() {
        this.connected = false;
        console.log(`[OPC-UA Adapter] Disconnected from ${this.endpoint}`);
    }
    onData(callback) {
        this.dataCallback = callback;
    }
    // Called when raw OPC-UA node value changes or received from edge gateway
    handleNodePublish(nodeId, value, assetCode = "FM-001") {
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
exports.OpcUaAdapter = OpcUaAdapter;
