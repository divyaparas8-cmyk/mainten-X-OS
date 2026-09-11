import { pgTable, uuid, varchar, text, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { tenants } from "./tenants.js";

// 1. Subscriptions Table
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  planId: varchar("plan_id", { length: 100 }).notNull(), // "pilot", "starter", "standard", "enterprise"
  planName: varchar("plan_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("ACTIVE").notNull(), // "ACTIVE", "TRIAL", "CANCELLED", "PAST_DUE"
  billingCycle: varchar("billing_cycle", { length: 50 }).default("MONTHLY").notNull(), // "MONTHLY", "ANNUAL", "TRIAL_7_DAYS"
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("INR").notNull(),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }).defaultNow().notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }).notNull(),
  razorpaySubscriptionId: varchar("razorpay_subscription_id", { length: 100 }),
  razorpayCustomerId: varchar("razorpay_customer_id", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 2. Payments & Transactions Table
export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
  orderId: varchar("order_id", { length: 100 }).notNull(), // Razorpay order_xxx
  paymentId: varchar("payment_id", { length: 100 }),       // Razorpay pay_xxx
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("INR").notNull(),
  status: varchar("status", { length: 50 }).default("CREATED").notNull(), // "CREATED", "AUTHORIZED", "CAPTURED", "FAILED", "REFUNDED"
  method: varchar("method", { length: 50 }),               // "card", "upi", "netbanking", "wallet"
  receiptNumber: varchar("receipt_number", { length: 100 }),
  razorpaySignature: varchar("razorpay_signature", { length: 255 }),
  notes: jsonb("notes").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 3. Payment Webhooks Audit & Idempotency Table
export const paymentWebhooks = pgTable("payment_webhooks", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: varchar("event_id", { length: 150 }).notNull().unique(), // Razorpay unique event ID
  eventType: varchar("event_type", { length: 100 }).notNull(),      // "payment.captured", "payment.failed", etc.
  payload: jsonb("payload").notNull(),
  status: varchar("status", { length: 50 }).default("PROCESSED").notNull(), // "PROCESSED", "IGNORED", "FAILED"
  error: text("error"),
  processedAt: timestamp("processed_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
