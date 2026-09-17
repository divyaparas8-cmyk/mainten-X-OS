"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantModules = exports.platformSettings = exports.supportTickets = exports.plans = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_js_1 = require("./tenants.js");
// 1. Dynamic Platform Pricing & Licensing Plans
exports.plans = (0, pg_core_1.pgTable)("plans", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(), // "plant-pilot", "individual-modules", "bundles", "maintenx-complete"
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    subtitle: (0, pg_core_1.text)("subtitle"),
    priceMonthly: (0, pg_core_1.numeric)("price_monthly", { precision: 12, scale: 2 }).default("0").notNull(),
    priceAnnual: (0, pg_core_1.numeric)("price_annual", { precision: 12, scale: 2 }).default("0").notNull(),
    currency: (0, pg_core_1.varchar)("currency", { length: 10 }).default("CAD").notNull(),
    duration: (0, pg_core_1.varchar)("duration", { length: 50 }).default("Unlimited").notNull(),
    userLimit: (0, pg_core_1.integer)("user_limit").default(10).notNull(),
    accessLevel: (0, pg_core_1.varchar)("access_level", { length: 50 }).default("Standard").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active").notNull(), // "Active", "Inactive"
    isPopular: (0, pg_core_1.boolean)("is_popular").default(false).notNull(),
    ctaText: (0, pg_core_1.varchar)("cta_text", { length: 100 }).default("Choose Plan").notNull(),
    modules: (0, pg_core_1.jsonb)("modules").default([]).notNull(), // array of enabled module keys
    features: (0, pg_core_1.jsonb)("features").default([]).notNull(), // array of feature strings
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
// 2. Global Support Tickets
exports.supportTickets = (0, pg_core_1.pgTable)("support_tickets", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(), // e.g. "TKT-1042"
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "set null" }),
    companyName: (0, pg_core_1.varchar)("company_name", { length: 255 }).notNull(),
    subject: (0, pg_core_1.varchar)("subject", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Open").notNull(), // "Open", "In Progress", "Resolved"
    priority: (0, pg_core_1.varchar)("priority", { length: 50 }).default("Medium").notNull(), // "Low", "Medium", "High"
    assignedTo: (0, pg_core_1.varchar)("assigned_to", { length: 255 }),
    resolution: (0, pg_core_1.text)("resolution"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
// 3. Global Platform Settings
exports.platformSettings = (0, pg_core_1.pgTable)("platform_settings", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey().default("global"),
    platformName: (0, pg_core_1.varchar)("platform_name", { length: 255 }).default("MaintenX-OS").notNull(),
    supportEmail: (0, pg_core_1.varchar)("support_email", { length: 255 }).default("support@maintenx.com").notNull(),
    require2fa: (0, pg_core_1.boolean)("require_2fa").default(true).notNull(),
    enforceStrongPasswords: (0, pg_core_1.boolean)("enforce_strong_passwords").default(true).notNull(),
    logAllIps: (0, pg_core_1.boolean)("log_all_ips").default(true).notNull(),
    maintenanceMode: (0, pg_core_1.boolean)("maintenance_mode").default(false).notNull(),
    maintenanceMessage: (0, pg_core_1.text)("maintenance_message"),
    defaultCurrency: (0, pg_core_1.varchar)("default_currency", { length: 10 }).default("CAD").notNull(),
    smtpConfig: (0, pg_core_1.jsonb)("smtp_config").default({}),
    branding: (0, pg_core_1.jsonb)("branding").default({}),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
// 4. Per-Tenant Module Entitlements
exports.tenantModules = (0, pg_core_1.pgTable)("tenant_modules", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    moduleKey: (0, pg_core_1.varchar)("module_key", { length: 100 }).notNull(), // "plan", "produce", "verify", "maintain", "move", "people", "improve", "intelligence"
    isEnabled: (0, pg_core_1.boolean)("is_enabled").default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.unique)("tenant_module_idx").on(table.tenantId, table.moduleKey),
]);
