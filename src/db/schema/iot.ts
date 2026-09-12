import { pgTable, uuid, varchar, text, timestamp, numeric, integer, jsonb } from "drizzle-orm/pg-core";
import { tenants } from "./tenants.js";

// 1. Normalized Machine Telemetry Time-Series Table
export const machineTelemetry = pgTable("machine_telemetry", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: varchar("plant_id", { length: 100 }).default("PLT-01").notNull(),
  assetId: varchar("asset_id", { length: 100 }).notNull(),
  assetCode: varchar("asset_code", { length: 100 }).notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
  status: varchar("status", { length: 50 }).default("RUNNING").notNull(), // "RUNNING", "STOPPED", "IDLE", "MAINTENANCE"
  productionCount: integer("production_count").default(0).notNull(),
  speed: numeric("speed", { precision: 10, scale: 2 }).default("0.00").notNull(),     // units/min or bpm
  cycleTime: numeric("cycle_time", { precision: 8, scale: 2 }).default("0.00").notNull(), // seconds
  downtime: integer("downtime").default(0).notNull(),                                  // minutes
  vibration: numeric("vibration", { precision: 8, scale: 3 }).default("0.000"),        // mm/s RMS
  temperature: numeric("temperature", { precision: 8, scale: 2 }).default("0.00"),    // °C
  pressure: numeric("pressure", { precision: 8, scale: 2 }).default("0.00"),          // Bar
  rpm: integer("rpm").default(0),
  powerKw: numeric("power_kw", { precision: 8, scale: 2 }).default("0.00"),
  flowRate: numeric("flow_rate", { precision: 10, scale: 2 }).default("0.00"),
  faultCode: varchar("fault_code", { length: 100 }),
  alarm: text("alarm"),
  source: varchar("source", { length: 50 }).default("SIMULATOR").notNull(), // "OPC_UA", "MQTT", "MODBUS", "SIMULATOR"
  rawPayload: jsonb("raw_payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 2. Industrial IoT Gateways & Edge Nodes Table
export const iotGateways = pgTable("iot_gateways", {
  id: varchar("id", { length: 100 }).primaryKey(), // e.g. "IOT-01"
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  protocol: varchar("protocol", { length: 100 }).notNull(), // "OPC-UA (TCP:4840)", "MQTT (TLS:8883)", "Modbus TCP (Port 502)"
  endpointUrl: varchar("endpoint_url", { length: 255 }),
  connectedNodes: integer("connected_nodes").default(0).notNull(),
  telemetryRate: varchar("telemetry_rate", { length: 50 }).default("10 Hz").notNull(),
  status: varchar("status", { length: 50 }).default("Connected").notNull(), // "Connected", "Disconnected", "Degraded"
  lastPingAt: timestamp("last_ping_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
