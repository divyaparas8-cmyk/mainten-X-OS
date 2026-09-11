import { pgTable, uuid, varchar, text, timestamp, boolean, numeric, integer, jsonb, unique } from "drizzle-orm/pg-core";
import { tenants } from "./tenants.js";

// 1. Dynamic Platform Pricing & Licensing Plans
export const plans = pgTable("plans", {
  id: varchar("id", { length: 100 }).primaryKey(), // "plant-pilot", "individual-modules", "bundles", "maintenx-complete"
  name: varchar("name", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  priceMonthly: numeric("price_monthly", { precision: 12, scale: 2 }).default("0").notNull(),
  priceAnnual: numeric("price_annual", { precision: 12, scale: 2 }).default("0").notNull(),
  currency: varchar("currency", { length: 10 }).default("CAD").notNull(),
  duration: varchar("duration", { length: 50 }).default("Unlimited").notNull(),
  userLimit: integer("user_limit").default(10).notNull(),
  accessLevel: varchar("access_level", { length: 50 }).default("Standard").notNull(),
  status: varchar("status", { length: 50 }).default("Active").notNull(), // "Active", "Inactive"
  isPopular: boolean("is_popular").default(false).notNull(),
  ctaText: varchar("cta_text", { length: 100 }).default("Choose Plan").notNull(),
  modules: jsonb("modules").default([]).notNull(), // array of enabled module keys
  features: jsonb("features").default([]).notNull(), // array of feature strings
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Global Support Tickets
export const supportTickets = pgTable("support_tickets", {
  id: varchar("id", { length: 100 }).primaryKey(), // e.g. "TKT-1042"
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "set null" }),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("Open").notNull(), // "Open", "In Progress", "Resolved"
  priority: varchar("priority", { length: 50 }).default("Medium").notNull(), // "Low", "Medium", "High"
  assignedTo: varchar("assigned_to", { length: 255 }),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Global Platform Settings
export const platformSettings = pgTable("platform_settings", {
  id: varchar("id", { length: 100 }).primaryKey().default("global"),
  platformName: varchar("platform_name", { length: 255 }).default("MaintenX-OS").notNull(),
  supportEmail: varchar("support_email", { length: 255 }).default("support@maintenx.com").notNull(),
  require2fa: boolean("require_2fa").default(true).notNull(),
  enforceStrongPasswords: boolean("enforce_strong_passwords").default(true).notNull(),
  logAllIps: boolean("log_all_ips").default(true).notNull(),
  maintenanceMode: boolean("maintenance_mode").default(false).notNull(),
  maintenanceMessage: text("maintenance_message"),
  defaultCurrency: varchar("default_currency", { length: 10 }).default("CAD").notNull(),
  smtpConfig: jsonb("smtp_config").default({}),
  branding: jsonb("branding").default({}),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 4. Per-Tenant Module Entitlements
export const tenantModules = pgTable(
  "tenant_modules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
    moduleKey: varchar("module_key", { length: 100 }).notNull(), // "plan", "produce", "verify", "maintain", "move", "people", "improve", "intelligence"
    isEnabled: boolean("is_enabled").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("tenant_module_idx").on(table.tenantId, table.moduleKey),
  ]
);
