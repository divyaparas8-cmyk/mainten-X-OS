import { NormalizedMachineEvent } from "../normalizers/telemetryNormalizer.js";
import { OpcUaAdapter } from "../adapters/opcua.adapter.js";
import { MqttAdapter } from "../adapters/mqtt.adapter.js";
import { ModbusAdapter } from "../adapters/modbus.adapter.js";
import { SimulatorAdapter } from "../adapters/simulator.adapter.js";
import { FastifyReply } from "fastify";
export declare class MachineDataService {
    private opcuaAdapter;
    private mqttAdapter;
    private modbusAdapter;
    private simulatorAdapter;
    private latestTelemetryByAsset;
    private sseSubscribers;
    private isSimulatorRunning;
    constructor();
    private seedInitialCache;
    ingest(rawPayload: any): Promise<NormalizedMachineEvent>;
    getLatestTelemetry(assetCode?: string): NormalizedMachineEvent | NormalizedMachineEvent[] | undefined;
    getHistory(assetCode: string, limit?: number): Promise<NormalizedMachineEvent[] | {
        status: string;
        id: string;
        createdAt: Date;
        tenantId: string | null;
        plantId: string;
        assetCode: string;
        assetId: string;
        timestamp: Date;
        productionCount: number;
        speed: string;
        cycleTime: string;
        downtime: number;
        vibration: string | null;
        temperature: string | null;
        pressure: string | null;
        rpm: number | null;
        powerKw: string | null;
        flowRate: string | null;
        faultCode: string | null;
        alarm: string | null;
        source: string;
        rawPayload: unknown;
    }[]>;
    addSseSubscriber(reply: FastifyReply): void;
    private broadcastEvent;
    startSimulator(): Promise<{
        status: string;
        message: string;
    }>;
    stopSimulator(): Promise<{
        status: string;
        message: string;
    }>;
    getSimulatorStatus(): {
        running: boolean;
        adapterStatus: {
            connected: boolean;
            endpoint: string;
            nodesCount: number;
            lastPing: string;
        };
    };
    listGateways(): Promise<{
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string | null;
        protocol: string;
        endpointUrl: string | null;
        connectedNodes: number;
        telemetryRate: string;
        lastPingAt: Date;
    }[] | {
        id: string;
        name: string;
        protocol: string;
        connectedNodes: number;
        telemetryRate: string;
        status: string;
    }[]>;
    getAdapters(): {
        opcua: OpcUaAdapter;
        mqtt: MqttAdapter;
        modbus: ModbusAdapter;
        simulator: SimulatorAdapter;
    };
}
export declare const machineDataService: MachineDataService;
//# sourceMappingURL=machineData.service.d.ts.map