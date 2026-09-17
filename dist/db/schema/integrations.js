"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeys = exports.barcodeFormats = exports.erpSyncEvents = exports.erpConnectorConfig = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_js_1 = require("./tenants.js");
// 1. ERP Connector Configuration
exports.erpConnectorConfig = (0, pg_core_1.pgTable)("erp_connector_config", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey().default("SAP_S4HANA"),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }),
    systemType: (0, pg_core_1.varchar)("system_type", { length: 100 }).default("SAP S/4HANA"),
    gatewayEndpoint: (0, pg_core_1.varchar)("gateway_endpoint", { length: 255 }).default("sap-prod-gw.corp.flowstate.io:3300"),
    clientSystem: (0, pg_core_1.varchar)("client_system", { length: 100 }).default("PRD_100 • S4H_CORP"),
    authMode: (0, pg_core_1.varchar)("auth_mode", { length: 100 }).default("OAuth2 mTLS Certificate"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Connected"),
    syncFrequency: (0, pg_core_1.varchar)("sync_frequency", { length: 50 }).default("15 Mins"),
    syncStatus: (0, pg_core_1.varchar)("sync_status", { length: 100 }).default("Synchronized (Last: 2 mins ago)"),
    connectorHealth: (0, pg_core_1.varchar)("connector_health", { length: 50 }).default("100%"),
    errorQueue: (0, pg_core_1.varchar)("error_queue", { length: 50 }).default("0 Errors"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow(),
});
// 2. ERP Synchronization Events Log
exports.erpSyncEvents = (0, pg_core_1.pgTable)("erp_sync_events", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }),
    time: (0, pg_core_1.varchar)("time", { length: 100 }).notNull(),
    eventType: (0, pg_core_1.varchar)("event_type", { length: 100 }).notNull(),
    entityScope: (0, pg_core_1.varchar)("entity_scope", { length: 255 }).notNull(),
    recordsProcessed: (0, pg_core_1.varchar)("records_processed", { length: 50 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Success").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow(),
});
// 3. Barcode & QR Symbologies
exports.barcodeFormats = (0, pg_core_1.pgTable)("barcode_formats", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(), // e.g. "BC-01"
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }),
    standard: (0, pg_core_1.varchar)("standard", { length: 255 }).notNull(),
    useCase: (0, pg_core_1.varchar)("use_case", { length: 255 }).notNull(),
    aiAppPrefix: (0, pg_core_1.varchar)("ai_app_prefix", { length: 255 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
// 4. REST API Keys & Webhook Credentials
exports.apiKeys = (0, pg_core_1.pgTable)("api_keys", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(), // e.g. "KEY-01"
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    keyMasked: (0, pg_core_1.varchar)("key_masked", { length: 255 }).notNull(),
    keyHash: (0, pg_core_1.varchar)("key_hash", { length: 255 }),
    rateLimit: (0, pg_core_1.varchar)("rate_limit", { length: 100 }).default("500 req/min").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
