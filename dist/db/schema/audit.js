"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.digitalSignatures = exports.auditLogs = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const users_1 = require("./users");
exports.auditLogs = (0, pg_core_1.pgTable)("audit_logs", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "set null" }),
    userId: (0, pg_core_1.uuid)("user_id").references(() => users_1.users.id, { onDelete: "set null" }),
    action: (0, pg_core_1.varchar)("action", { length: 100 }).notNull(), // CREATE, UPDATE, DELETE, APPROVE, QA_RELEASE, REVISE
    entityType: (0, pg_core_1.varchar)("entity_type", { length: 100 }).notNull(), // ProductionOrder, Batch, CCPCheck, WorkOrder
    entityId: (0, pg_core_1.varchar)("entity_id", { length: 255 }).notNull(),
    oldValues: (0, pg_core_1.jsonb)("old_values"),
    newValues: (0, pg_core_1.jsonb)("new_values"),
    ipAddress: (0, pg_core_1.varchar)("ip_address", { length: 50 }),
    userAgent: (0, pg_core_1.text)("user_agent"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.digitalSignatures = (0, pg_core_1.pgTable)("digital_signatures", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "set null" }),
    userId: (0, pg_core_1.uuid)("user_id").references(() => users_1.users.id, { onDelete: "restrict" }).notNull(),
    entityType: (0, pg_core_1.varchar)("entity_type", { length: 100 }).notNull(),
    entityId: (0, pg_core_1.varchar)("entity_id", { length: 255 }).notNull(),
    meaning: (0, pg_core_1.varchar)("meaning", { length: 255 }).notNull(), // "Author of Batch Record", "QA Release Disposition"
    comments: (0, pg_core_1.text)("comments"),
    signedAt: (0, pg_core_1.timestamp)("signed_at").defaultNow().notNull(),
});
//# sourceMappingURL=audit.js.map