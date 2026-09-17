"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemGovernanceReports = exports.dataMigrationBatches = exports.dataHealthRemediations = exports.dataHealthStaleRecords = exports.dataHealthBrokenRelationships = exports.dataHealthInvalidReferences = exports.dataHealthDuplicates = exports.dataHealthMissing = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.dataHealthMissing = (0, pg_core_1.pgTable)("data_health_missing", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id"),
    tableName: (0, pg_core_1.varchar)("table_name", { length: 255 }).notNull(),
    recordKey: (0, pg_core_1.varchar)("record_key", { length: 255 }).notNull(),
    fieldName: (0, pg_core_1.varchar)("field_name", { length: 255 }).notNull(),
    suggestion: (0, pg_core_1.text)("suggestion").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull().default("Open"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow(),
});
exports.dataHealthDuplicates = (0, pg_core_1.pgTable)("data_health_duplicates", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id"),
    entityType: (0, pg_core_1.varchar)("entity_type", { length: 255 }).notNull(),
    primaryRecord: (0, pg_core_1.varchar)("primary_record", { length: 255 }).notNull(),
    duplicateRecord: (0, pg_core_1.varchar)("duplicate_record", { length: 255 }).notNull(),
    similarity: (0, pg_core_1.varchar)("similarity", { length: 50 }).notNull().default("95% Match"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull().default("Potential Duplicate"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow(),
});
exports.dataHealthInvalidReferences = (0, pg_core_1.pgTable)("data_health_invalid_references", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id"),
    parentTable: (0, pg_core_1.varchar)("parent_table", { length: 255 }).notNull(),
    referencedField: (0, pg_core_1.varchar)("referenced_field", { length: 255 }).notNull(),
    foreignId: (0, pg_core_1.varchar)("foreign_id", { length: 255 }).notNull(),
    issue: (0, pg_core_1.text)("issue").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull().default("Invalid Reference"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow(),
});
exports.dataHealthBrokenRelationships = (0, pg_core_1.pgTable)("data_health_broken_relationships", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id"),
    fromEntity: (0, pg_core_1.varchar)("from_entity", { length: 255 }).notNull(),
    toEntity: (0, pg_core_1.varchar)("to_entity", { length: 255 }).notNull(),
    relationship: (0, pg_core_1.varchar)("relationship", { length: 255 }).notNull(),
    issue: (0, pg_core_1.text)("issue").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull().default("Broken Relationship"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow(),
});
exports.dataHealthStaleRecords = (0, pg_core_1.pgTable)("data_health_stale_records", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id"),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    tableName: (0, pg_core_1.varchar)("table_name", { length: 255 }).notNull(),
    lastProduced: (0, pg_core_1.varchar)("last_produced", { length: 100 }).notNull(),
    inventoryOnHand: (0, pg_core_1.varchar)("inventory_on_hand", { length: 50 }).notNull().default("0"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull().default("Stale / Obsolete"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow(),
});
exports.dataHealthRemediations = (0, pg_core_1.pgTable)("data_health_remediations", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.varchar)("tenant_id", { length: 100 }),
    rule: (0, pg_core_1.varchar)("rule", { length: 255 }).notNull(),
    affectedTable: (0, pg_core_1.varchar)("affected_table", { length: 255 }).notNull(),
    recordsHealed: (0, pg_core_1.varchar)("records_healed", { length: 50 }).default("1"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull().default("Auto-Healed"),
    executionTimestamp: (0, pg_core_1.varchar)("execution_timestamp", { length: 100 }),
    details: (0, pg_core_1.text)("details"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow(),
});
exports.dataMigrationBatches = (0, pg_core_1.pgTable)("data_migration_batches", {
    id: (0, pg_core_1.varchar)("id", { length: 64 }).primaryKey(),
    tenantId: (0, pg_core_1.varchar)("tenant_id", { length: 64 }),
    target: (0, pg_core_1.varchar)("target", { length: 255 }).notNull(),
    connector: (0, pg_core_1.varchar)("connector", { length: 255 }).notNull(),
    transferred: (0, pg_core_1.varchar)("transferred", { length: 100 }).notNull(),
    conformity: (0, pg_core_1.varchar)("conformity", { length: 50 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 100 }).notNull(),
    recordsCount: (0, pg_core_1.integer)("records_count").default(0),
    details: (0, pg_core_1.jsonb)("details"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow(),
});
exports.systemGovernanceReports = (0, pg_core_1.pgTable)("system_governance_reports", {
    id: (0, pg_core_1.varchar)("id", { length: 64 }).primaryKey(),
    tenantId: (0, pg_core_1.varchar)("tenant_id", { length: 64 }),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    uptime: (0, pg_core_1.varchar)("uptime", { length: 50 }).notNull(),
    dbStorage: (0, pg_core_1.varchar)("db_storage", { length: 50 }).notNull(),
    apiLatency: (0, pg_core_1.varchar)("api_latency", { length: 50 }).notNull(),
    licensesUsed: (0, pg_core_1.integer)("licenses_used").default(13),
    licensesTotal: (0, pg_core_1.integer)("licenses_total").default(100),
    tier: (0, pg_core_1.varchar)("tier", { length: 100 }).default("ENTERPRISE TIER ACTIVE"),
    edgeHealth: (0, pg_core_1.varchar)("edge_health", { length: 100 }).default("99.99% HEALTH"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("PUBLISHED"),
    generatedBy: (0, pg_core_1.varchar)("generated_by", { length: 128 }).default("Alexander Vance"),
    metrics: (0, pg_core_1.jsonb)("metrics"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow(),
});
//# sourceMappingURL=datahealth.js.map