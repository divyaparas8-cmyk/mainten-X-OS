"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModbusAdapter = void 0;
class ModbusAdapter {
    name = "Modbus TCP Gateway Adapter";
    protocol = "MODBUS";
    host;
    port;
    connected = false;
    dataCallback;
    constructor(host = "192.168.2.50", port = 502) {
        this.host = host;
        this.port = port;
    }
    async connect() {
        this.connected = true;
        console.log(`[Modbus Adapter] Connected to Modbus-TCP slave at ${this.host}:${this.port}`);
    }
    async disconnect() {
        this.connected = false;
        console.log(`[Modbus Adapter] Disconnected from ${this.host}:${this.port}`);
    }
    onData(callback) {
        this.dataCallback = callback;
    }
    handleRegisters(unitId, registers, assetCode = "CP-002") {
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
exports.ModbusAdapter = ModbusAdapter;
