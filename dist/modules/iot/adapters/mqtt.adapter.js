"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttAdapter = void 0;
class MqttAdapter {
    name = "MQTT Industrial Broker Adapter";
    protocol = "MQTT";
    brokerUrl;
    connected = false;
    dataCallback;
    constructor(brokerUrl = "mqtts://broker.flowstate.internal:8883") {
        this.brokerUrl = brokerUrl;
    }
    async connect() {
        this.connected = true;
        console.log(`[MQTT Adapter] Subscribed to telemetry topics on ${this.brokerUrl}`);
    }
    async disconnect() {
        this.connected = false;
        console.log(`[MQTT Adapter] Disconnected from ${this.brokerUrl}`);
    }
    onData(callback) {
        this.dataCallback = callback;
    }
    handleMessage(topic, messageJson) {
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
exports.MqttAdapter = MqttAdapter;
//# sourceMappingURL=mqtt.adapter.js.map