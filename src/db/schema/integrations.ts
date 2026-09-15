import { pgTable, uuid, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";
import { tenants } from "./tenants.js";

// 1. ERP Connector Configuration
export const erpConnectorConfig = pgTable("erp_connector_config", {
  id: varchar("id", { length: 100 }).primaryKey().default("SAP_S4HANA"),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  systemType: varchar("system_type", { length: 100 }).default("SAP S/4HANA"),
  gatewayEndpoint: varchar("gateway_endpoint", { length: 255 }).default("sap-prod-gw.corp.flowstate.io:3300"),
  clientSystem: varchar("client_system", { length: 100 }).default("PRD_100 • S4H_CORP"),
  authMode: varchar("auth_mode", { length: 100 }).default("OAuth2 mTLS Certificate"),
  status: varchar("status", { length: 50 }).default("Connected"),
  syncFrequency: varchar("sync_frequency", { length: 50 }).default("15 Mins"),
  syncStatus: varchar("sync_status", { length: 100 }).default("Synchronized (Last: 2 mins ago)"),
  connectorHealth: varchar("connector_health", { length: 50 }).default("100%"),
  errorQueue: varchar("error_queue", { length: 50 }).default("0 Errors"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 2. ERP Synchronization Events Log
export const erpSyncEvents = pgTable("erp_sync_events", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  time: varchar("time", { length: 100 }).notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  entityScope: varchar("entity_scope", { length: 255 }).notNull(),
  recordsProcessed: varchar("records_processed", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).default("Success").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 3. Barcode & QR Symbologies
export const barcodeFormats = pgTable("barcode_formats", {
  id: varchar("id", { length: 100 }).primaryKey(), // e.g. "BC-01"
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  standard: varchar("standard", { length: 255 }).notNull(),
  useCase: varchar("use_case", { length: 255 }).notNull(),
  aiAppPrefix: varchar("ai_app_prefix", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("Active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 4. REST API Keys & Webhook Credentials
export const apiKeys = pgTable("api_keys", {
  id: varchar("id", { length: 100 }).primaryKey(), // e.g. "KEY-01"
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  keyMasked: varchar("key_masked", { length: 255 }).notNull(),
  keyHash: varchar("key_hash", { length: 255 }),
  rateLimit: varchar("rate_limit", { length: 100 }).default("500 req/min").notNull(),
  status: varchar("status", { length: 50 }).default("Active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
