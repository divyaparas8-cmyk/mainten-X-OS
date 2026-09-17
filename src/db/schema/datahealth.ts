import { pgTable, varchar, text, timestamp, uuid, integer, jsonb } from "drizzle-orm/pg-core";

export const dataHealthMissing = pgTable("data_health_missing", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: uuid("tenant_id"),
  tableName: varchar("table_name", { length: 255 }).notNull(),
  recordKey: varchar("record_key", { length: 255 }).notNull(),
  fieldName: varchar("field_name", { length: 255 }).notNull(),
  suggestion: text("suggestion").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("Open"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const dataHealthDuplicates = pgTable("data_health_duplicates", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: uuid("tenant_id"),
  entityType: varchar("entity_type", { length: 255 }).notNull(),
  primaryRecord: varchar("primary_record", { length: 255 }).notNull(),
  duplicateRecord: varchar("duplicate_record", { length: 255 }).notNull(),
  similarity: varchar("similarity", { length: 50 }).notNull().default("95% Match"),
  status: varchar("status", { length: 50 }).notNull().default("Potential Duplicate"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const dataHealthInvalidReferences = pgTable("data_health_invalid_references", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: uuid("tenant_id"),
  parentTable: varchar("parent_table", { length: 255 }).notNull(),
  referencedField: varchar("referenced_field", { length: 255 }).notNull(),
  foreignId: varchar("foreign_id", { length: 255 }).notNull(),
  issue: text("issue").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("Invalid Reference"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const dataHealthBrokenRelationships = pgTable("data_health_broken_relationships", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: uuid("tenant_id"),
  fromEntity: varchar("from_entity", { length: 255 }).notNull(),
  toEntity: varchar("to_entity", { length: 255 }).notNull(),
  relationship: varchar("relationship", { length: 255 }).notNull(),
  issue: text("issue").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("Broken Relationship"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const dataHealthStaleRecords = pgTable("data_health_stale_records", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: uuid("tenant_id"),
  name: varchar("name", { length: 255 }).notNull(),
  tableName: varchar("table_name", { length: 255 }).notNull(),
  lastProduced: varchar("last_produced", { length: 100 }).notNull(),
  inventoryOnHand: varchar("inventory_on_hand", { length: 50 }).notNull().default("0"),
  status: varchar("status", { length: 50 }).notNull().default("Stale / Obsolete"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const dataHealthRemediations = pgTable("data_health_remediations", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: varchar("tenant_id", { length: 100 }),
  rule: varchar("rule", { length: 255 }).notNull(),
  affectedTable: varchar("affected_table", { length: 255 }).notNull(),
  recordsHealed: varchar("records_healed", { length: 50 }).default("1"),
  status: varchar("status", { length: 50 }).notNull().default("Auto-Healed"),
  executionTimestamp: varchar("execution_timestamp", { length: 100 }),
  details: text("details"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const dataMigrationBatches = pgTable("data_migration_batches", {
  id: varchar("id", { length: 64 }).primaryKey(),
  tenantId: varchar("tenant_id", { length: 64 }),
  target: varchar("target", { length: 255 }).notNull(),
  connector: varchar("connector", { length: 255 }).notNull(),
  transferred: varchar("transferred", { length: 100 }).notNull(),
  conformity: varchar("conformity", { length: 50 }).notNull(),
  status: varchar("status", { length: 100 }).notNull(),
  recordsCount: integer("records_count").default(0),
  details: jsonb("details"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const systemGovernanceReports = pgTable("system_governance_reports", {
  id: varchar("id", { length: 64 }).primaryKey(),
  tenantId: varchar("tenant_id", { length: 64 }),
  title: varchar("title", { length: 255 }).notNull(),
  uptime: varchar("uptime", { length: 50 }).notNull(),
  dbStorage: varchar("db_storage", { length: 50 }).notNull(),
  apiLatency: varchar("api_latency", { length: 50 }).notNull(),
  licensesUsed: integer("licenses_used").default(13),
  licensesTotal: integer("licenses_total").default(100),
  tier: varchar("tier", { length: 100 }).default("ENTERPRISE TIER ACTIVE"),
  edgeHealth: varchar("edge_health", { length: 100 }).default("99.99% HEALTH"),
  status: varchar("status", { length: 50 }).default("PUBLISHED"),
  generatedBy: varchar("generated_by", { length: 128 }).default("Alexander Vance"),
  metrics: jsonb("metrics"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
