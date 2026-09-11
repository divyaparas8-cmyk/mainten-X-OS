import { pgTable, uuid, varchar, text, timestamp, boolean, numeric, integer, jsonb } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

export const plans = pgTable("plans", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  priceMonthly: numeric("price_monthly", { precision: 12, scale: 2 }).default("0").notNull(),
  priceAnnual: numeric("price_annual", { precision: 12, scale: 2 }).default("0").notNull(),
  currency: varchar("currency", { length: 10 }).default("CAD").notNull(),
  duration: varchar("duration", { length: 50 }).default("Unlimited").notNull(),
  userLimit: integer("user_limit").default(10).notNull(),
  accessLevel: varchar("access_level", { length: 50 }).default("Standard").notNull(),
  status: varchar("status", { length: 50 }).default("Active").notNull(),
  isPopular: boolean("is_popular").default(false).notNull(),
  ctaText: varchar("cta_text", { length: 100 }).default("Choose Plan").notNull(),
  modules: jsonb("modules").default([]).notNull(),
  features: jsonb("features").default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  planId: varchar("plan_id", { length: 100 }).notNull(),
  planName: varchar("plan_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("ACTIVE").notNull(),
  billingCycle: varchar("billing_cycle", { length: 50 }).default("MONTHLY").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("INR").notNull(),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }).defaultNow().notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }).notNull(),
  razorpaySubscriptionId: varchar("razorpay_subscription_id", { length: 100 }),
  razorpayCustomerId: varchar("razorpay_customer_id", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
  orderId: varchar("order_id", { length: 100 }).notNull(),
  paymentId: varchar("payment_id", { length: 100 }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("INR").notNull(),
  status: varchar("status", { length: 50 }).default("CREATED").notNull(),
  method: varchar("method", { length: 50 }),
  receiptNumber: varchar("receipt_number", { length: 100 }),
  razorpaySignature: varchar("razorpay_signature", { length: 255 }),
  notes: jsonb("notes").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const paymentWebhooks = pgTable("payment_webhooks", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: varchar("event_id", { length: 150 }).notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  payload: jsonb("payload").notNull(),
  status: varchar("status", { length: 50 }).default("PROCESSED").notNull(),
  error: text("error"),
  processedAt: timestamp("processed_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const platformSettings = pgTable("platform_settings", {
  id: varchar("id", { length: 100 }).default("global").primaryKey(),
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

export const supportTickets = pgTable("support_tickets", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("Open").notNull(),
  priority: varchar("priority", { length: 50 }).default("Medium").notNull(),
  assignedTo: varchar("assigned_to", { length: 255 }),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tenantModules = pgTable("tenant_modules", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  moduleKey: varchar("module_key", { length: 100 }).notNull(),
  isEnabled: boolean("is_enabled").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
