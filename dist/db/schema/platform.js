"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantModules = exports.supportTickets = exports.platformSettings = exports.paymentWebhooks = exports.payments = exports.subscriptions = exports.plans = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
exports.plans = (0, pg_core_1.pgTable)("plans", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    subtitle: (0, pg_core_1.text)("subtitle"),
    priceMonthly: (0, pg_core_1.numeric)("price_monthly", { precision: 12, scale: 2 }).default("0").notNull(),
    priceAnnual: (0, pg_core_1.numeric)("price_annual", { precision: 12, scale: 2 }).default("0").notNull(),
    currency: (0, pg_core_1.varchar)("currency", { length: 10 }).default("CAD").notNull(),
    duration: (0, pg_core_1.varchar)("duration", { length: 50 }).default("Unlimited").notNull(),
    userLimit: (0, pg_core_1.integer)("user_limit").default(10).notNull(),
    accessLevel: (0, pg_core_1.varchar)("access_level", { length: 50 }).default("Standard").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active").notNull(),
    isPopular: (0, pg_core_1.boolean)("is_popular").default(false).notNull(),
    ctaText: (0, pg_core_1.varchar)("cta_text", { length: 100 }).default("Choose Plan").notNull(),
    modules: (0, pg_core_1.jsonb)("modules").default([]).notNull(),
    features: (0, pg_core_1.jsonb)("features").default([]).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.subscriptions = (0, pg_core_1.pgTable)("subscriptions", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    planId: (0, pg_core_1.varchar)("plan_id", { length: 100 }).notNull(),
    planName: (0, pg_core_1.varchar)("plan_name", { length: 255 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("ACTIVE").notNull(),
    billingCycle: (0, pg_core_1.varchar)("billing_cycle", { length: 50 }).default("MONTHLY").notNull(),
    amount: (0, pg_core_1.numeric)("amount", { precision: 12, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)("currency", { length: 10 }).default("INR").notNull(),
    currentPeriodStart: (0, pg_core_1.timestamp)("current_period_start", { withTimezone: true }).defaultNow().notNull(),
    currentPeriodEnd: (0, pg_core_1.timestamp)("current_period_end", { withTimezone: true }).notNull(),
    razorpaySubscriptionId: (0, pg_core_1.varchar)("razorpay_subscription_id", { length: 100 }),
    razorpayCustomerId: (0, pg_core_1.varchar)("razorpay_customer_id", { length: 100 }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
exports.payments = (0, pg_core_1.pgTable)("payments", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    subscriptionId: (0, pg_core_1.uuid)("subscription_id").references(() => exports.subscriptions.id, { onDelete: "set null" }),
    orderId: (0, pg_core_1.varchar)("order_id", { length: 100 }).notNull(),
    paymentId: (0, pg_core_1.varchar)("payment_id", { length: 100 }),
    amount: (0, pg_core_1.numeric)("amount", { precision: 12, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)("currency", { length: 10 }).default("INR").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("CREATED").notNull(),
    method: (0, pg_core_1.varchar)("method", { length: 50 }),
    receiptNumber: (0, pg_core_1.varchar)("receipt_number", { length: 100 }),
    razorpaySignature: (0, pg_core_1.varchar)("razorpay_signature", { length: 255 }),
    notes: (0, pg_core_1.jsonb)("notes").default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
exports.paymentWebhooks = (0, pg_core_1.pgTable)("payment_webhooks", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    eventId: (0, pg_core_1.varchar)("event_id", { length: 150 }).notNull(),
    eventType: (0, pg_core_1.varchar)("event_type", { length: 100 }).notNull(),
    payload: (0, pg_core_1.jsonb)("payload").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("PROCESSED").notNull(),
    error: (0, pg_core_1.text)("error"),
    processedAt: (0, pg_core_1.timestamp)("processed_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
});
exports.platformSettings = (0, pg_core_1.pgTable)("platform_settings", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).default("global").primaryKey(),
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
exports.supportTickets = (0, pg_core_1.pgTable)("support_tickets", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }),
    companyName: (0, pg_core_1.varchar)("company_name", { length: 255 }).notNull(),
    subject: (0, pg_core_1.varchar)("subject", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Open").notNull(),
    priority: (0, pg_core_1.varchar)("priority", { length: 50 }).default("Medium").notNull(),
    assignedTo: (0, pg_core_1.varchar)("assigned_to", { length: 255 }),
    resolution: (0, pg_core_1.text)("resolution"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.tenantModules = (0, pg_core_1.pgTable)("tenant_modules", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    moduleKey: (0, pg_core_1.varchar)("module_key", { length: 100 }).notNull(),
    isEnabled: (0, pg_core_1.boolean)("is_enabled").default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
//# sourceMappingURL=platform.js.map