"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departments = exports.companies = exports.plants = exports.tenants = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.tenants = (0, pg_core_1.pgTable)("tenants", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)("slug", { length: 100 }).notNull().unique(),
    plan: (0, pg_core_1.varchar)("plan", { length: 50 }).default("ENTERPRISE").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("ACTIVE").notNull(),
    settings: (0, pg_core_1.jsonb)("settings").default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.plants = (0, pg_core_1.pgTable)("plants", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => exports.tenants.id, { onDelete: "cascade" }).notNull(),
    code: (0, pg_core_1.varchar)("code", { length: 50 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    city: (0, pg_core_1.varchar)("city", { length: 100 }).notNull(),
    state: (0, pg_core_1.varchar)("state", { length: 100 }),
    country: (0, pg_core_1.varchar)("country", { length: 100 }).default("India"),
    timezone: (0, pg_core_1.varchar)("timezone", { length: 100 }).default("Asia/Kolkata").notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.companies = (0, pg_core_1.pgTable)("companies", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    code: (0, pg_core_1.varchar)("code", { length: 50 }),
    industry: (0, pg_core_1.varchar)("industry", { length: 100 }),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.departments = (0, pg_core_1.pgTable)("departments", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => exports.tenants.id, { onDelete: "cascade" }),
    code: (0, pg_core_1.varchar)("code", { length: 50 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    managerName: (0, pg_core_1.varchar)("manager_name", { length: 255 }),
    isActive: (0, pg_core_1.boolean)("is_active").default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
//# sourceMappingURL=tenants.js.map