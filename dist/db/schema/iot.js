"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iotGateways = exports.machineTelemetry = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_js_1 = require("./tenants.js");
// 1. Normalized Machine Telemetry Time-Series Table
exports.machineTelemetry = (0, pg_core_1.pgTable)("machine_telemetry", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }),
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 100 }).default("PLT-01").notNull(),
    assetId: (0, pg_core_1.varchar)("asset_id", { length: 100 }).notNull(),
    assetCode: (0, pg_core_1.varchar)("asset_code", { length: 100 }).notNull(),
    timestamp: (0, pg_core_1.timestamp)("timestamp", { withTimezone: true }).defaultNow().notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("RUNNING").notNull(), // "RUNNING", "STOPPED", "IDLE", "MAINTENANCE"
    productionCount: (0, pg_core_1.integer)("production_count").default(0).notNull(),
    speed: (0, pg_core_1.numeric)("speed", { precision: 10, scale: 2 }).default("0.00").notNull(), // units/min or bpm
    cycleTime: (0, pg_core_1.numeric)("cycle_time", { precision: 8, scale: 2 }).default("0.00").notNull(), // seconds
    downtime: (0, pg_core_1.integer)("downtime").default(0).notNull(), // minutes
    vibration: (0, pg_core_1.numeric)("vibration", { precision: 8, scale: 3 }).default("0.000"), // mm/s RMS
    temperature: (0, pg_core_1.numeric)("temperature", { precision: 8, scale: 2 }).default("0.00"), // °C
    pressure: (0, pg_core_1.numeric)("pressure", { precision: 8, scale: 2 }).default("0.00"), // Bar
    rpm: (0, pg_core_1.integer)("rpm").default(0),
    powerKw: (0, pg_core_1.numeric)("power_kw", { precision: 8, scale: 2 }).default("0.00"),
    flowRate: (0, pg_core_1.numeric)("flow_rate", { precision: 10, scale: 2 }).default("0.00"),
    faultCode: (0, pg_core_1.varchar)("fault_code", { length: 100 }),
    alarm: (0, pg_core_1.text)("alarm"),
    source: (0, pg_core_1.varchar)("source", { length: 50 }).default("SIMULATOR").notNull(), // "OPC_UA", "MQTT", "MODBUS", "SIMULATOR"
    rawPayload: (0, pg_core_1.jsonb)("raw_payload"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
});
// 2. Industrial IoT Gateways & Edge Nodes Table
exports.iotGateways = (0, pg_core_1.pgTable)("iot_gateways", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(), // e.g. "IOT-01"
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    protocol: (0, pg_core_1.varchar)("protocol", { length: 100 }).notNull(), // "OPC-UA (TCP:4840)", "MQTT (TLS:8883)", "Modbus TCP (Port 502)"
    endpointUrl: (0, pg_core_1.varchar)("endpoint_url", { length: 255 }),
    connectedNodes: (0, pg_core_1.integer)("connected_nodes").default(0).notNull(),
    telemetryRate: (0, pg_core_1.varchar)("telemetry_rate", { length: 50 }).default("10 Hz").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Connected").notNull(), // "Connected", "Disconnected", "Degraded"
    lastPingAt: (0, pg_core_1.timestamp)("last_ping_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
