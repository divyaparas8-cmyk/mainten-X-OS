"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulatorAdapter = void 0;
class SimulatorAdapter {
    name = "Industrial Telemetry Synthetic Simulator";
    protocol = "SIMULATOR";
    running = false;
    intervalTimer = null;
    intervalMs;
    dataCallback;
    assetStates = {
        "FM-001": {
            name: "Rotary Filling Machine",
            productionCount: 32450,
            baseSpeed: 250,
            vibrationBase: 2.1,
            tempBase: 62.4,
            pressureBase: 6.2,
            status: "RUNNING",
        },
        "CP-002": {
            name: "Automatic Capping Station",
            productionCount: 32442,
            baseSpeed: 250,
            vibrationBase: 2.85, // near warning threshold
            tempBase: 64.1,
            pressureBase: 5.8,
            status: "RUNNING",
        },
        "LB-003": {
            name: "High-Speed Rotary Labeler",
            productionCount: 32410,
            baseSpeed: 248,
            vibrationBase: 1.4,
            tempBase: 48.2,
            pressureBase: 4.5,
            status: "RUNNING",
        },
    };
    constructor(intervalMs = 3000) {
        this.intervalMs = intervalMs;
    }
    async connect() {
        this.running = true;
        console.log(`[Simulator Adapter] Telemetry generator running (${this.intervalMs}ms tick)`);
        this.startLoop();
    }
    async disconnect() {
        this.running = false;
        if (this.intervalTimer) {
            clearInterval(this.intervalTimer);
            this.intervalTimer = null;
        }
        console.log("[Simulator Adapter] Telemetry generator stopped");
    }
    onData(callback) {
        this.dataCallback = callback;
    }
    startLoop() {
        if (this.intervalTimer)
            clearInterval(this.intervalTimer);
        this.intervalTimer = setInterval(() => {
            if (!this.running || !this.dataCallback)
                return;
            const assets = Object.keys(this.assetStates);
            const selectedKey = assets[Math.floor(Math.random() * assets.length)];
            const asset = this.assetStates[selectedKey];
            // Calculate realistic stochastic jitter
            const speedJitter = (Math.random() - 0.5) * 8;
            const vibJitter = (Math.random() - 0.5) * 0.18;
            const tempJitter = (Math.random() - 0.5) * 0.4;
            const countIncrement = Math.floor(Math.random() * 5) + 3;
            asset.productionCount += countIncrement;
            const speed = Math.max(0, Math.round((asset.baseSpeed + speedJitter) * 10) / 10);
            const vibration = Math.max(0.1, Math.round((asset.vibrationBase + vibJitter) * 1000) / 1000);
            const temperature = Math.max(20, Math.round((asset.tempBase + tempJitter) * 10) / 10);
            const pressure = Math.max(1, Math.round((asset.pressureBase + (Math.random() - 0.5) * 0.2) * 10) / 10);
            const rpm = Math.round(speed * 4.8);
            const cycleTime = Math.round((60 / (speed || 1)) * 100) / 100;
            this.dataCallback({
                source: "SIMULATOR",
                assetId: selectedKey,
                assetCode: selectedKey,
                plantId: "PLT-01",
                status: asset.status,
                productionCount: asset.productionCount,
                speed,
                cycleTime,
                downtime: 0,
                vibration,
                temperature,
                pressure,
                rpm,
                powerKw: Math.round((45.2 + (Math.random() - 0.5) * 2.0) * 10) / 10,
                flowRate: Math.round((9400 + (Math.random() - 0.5) * 150) * 10) / 10,
                timestamp: new Date().toISOString(),
            });
        }, this.intervalMs);
    }
    getStatus() {
        return {
            connected: this.running,
            endpoint: `synthetic://in-memory-engine?interval=${this.intervalMs}ms`,
            nodesCount: Object.keys(this.assetStates).length,
            lastPing: new Date().toISOString(),
        };
    }
}
exports.SimulatorAdapter = SimulatorAdapter;
//# sourceMappingURL=simulator.adapter.js.map