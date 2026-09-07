"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchasingVendors = exports.ciIdeas = exports.documents = exports.exceptions = exports.notifications = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const users_1 = require("./users");
exports.notifications = (0, pg_core_1.pgTable)("notifications", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }),
    userId: (0, pg_core_1.uuid)("user_id").references(() => users_1.users.id, { onDelete: "cascade" }),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    message: (0, pg_core_1.text)("message").notNull(),
    category: (0, pg_core_1.varchar)("category", { length: 100 }).default("SYSTEM").notNull(), // "PRODUCTION", "QUALITY_CCP", "MAINTENANCE", "WAREHOUSE", "PLANNING"
    severity: (0, pg_core_1.varchar)("severity", { length: 50 }).default("INFO").notNull(), // "INFO", "WARNING", "CRITICAL"
    isRead: (0, pg_core_1.boolean)("is_read").default(false).notNull(),
    linkUrl: (0, pg_core_1.text)("link_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.exceptions = (0, pg_core_1.pgTable)("exceptions", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    exceptionCode: (0, pg_core_1.varchar)("exception_code", { length: 100 }).notNull(), // "EX-2026-001"
    severity: (0, pg_core_1.varchar)("severity", { length: 50 }).default("P1").notNull(), // "P1", "P2", "P3"
    module: (0, pg_core_1.varchar)("module", { length: 100 }).notNull(), // "PRODUCTION", "QUALITY", "MAINTENANCE", "WAREHOUSE"
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("ACTIVE").notNull(), // "ACTIVE", "ACKNOWLEDGED", "RESOLVED"
    reportedAt: (0, pg_core_1.timestamp)("reported_at").defaultNow().notNull(),
    resolvedAt: (0, pg_core_1.timestamp)("resolved_at"),
});
exports.documents = (0, pg_core_1.pgTable)("documents", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }),
    docCode: (0, pg_core_1.varchar)("doc_code", { length: 100 }).notNull(), // "SOP-BOT-004"
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    category: (0, pg_core_1.varchar)("category", { length: 100 }).default("SOP").notNull(),
    version: (0, pg_core_1.varchar)("version", { length: 50 }).default("v1.0").notNull(),
    fileUrl: (0, pg_core_1.text)("file_url"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("APPROVED").notNull(),
    authorId: (0, pg_core_1.uuid)("author_id").references(() => users_1.users.id, { onDelete: "set null" }),
    approvedBy: (0, pg_core_1.uuid)("approved_by").references(() => users_1.users.id, { onDelete: "set null" }),
    effectiveDate: (0, pg_core_1.timestamp)("effective_date").defaultNow().notNull(),
});
exports.ciIdeas = (0, pg_core_1.pgTable)("ci_ideas", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    category: (0, pg_core_1.varchar)("category", { length: 100 }).default("OEE_IMPROVEMENT").notNull(),
    problemStatement: (0, pg_core_1.text)("problem_statement").notNull(),
    proposedSolution: (0, pg_core_1.text)("proposed_solution").notNull(),
    estimatedSavings: (0, pg_core_1.numeric)("estimated_savings", { precision: 12, scale: 2 }).default("0.00"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("PROPOSED").notNull(), // "PROPOSED", "IN_REVIEW", "IMPLEMENTED", "REJECTED"
    submittedBy: (0, pg_core_1.uuid)("submitted_by").references(() => users_1.users.id, { onDelete: "set null" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.purchasingVendors = (0, pg_core_1.pgTable)("purchasing_vendors", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    vendorCode: (0, pg_core_1.varchar)("vendor_code", { length: 100 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    contactEmail: (0, pg_core_1.varchar)("contact_email", { length: 255 }),
    phone: (0, pg_core_1.varchar)("phone", { length: 50 }),
    rating: (0, pg_core_1.numeric)("rating", { precision: 3, scale: 2 }).default("4.8"),
    leadTimeDays: (0, pg_core_1.integer)("lead_time_days").default(5),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("ACTIVE").notNull(),
});
//# sourceMappingURL=common.js.map