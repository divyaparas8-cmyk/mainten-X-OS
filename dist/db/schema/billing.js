"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentWebhooks = exports.payments = exports.subscriptions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_js_1 = require("./tenants.js");
// 1. Subscriptions Table
exports.subscriptions = (0, pg_core_1.pgTable)("subscriptions", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    planId: (0, pg_core_1.varchar)("plan_id", { length: 100 }).notNull(), // "pilot", "starter", "standard", "enterprise"
    planName: (0, pg_core_1.varchar)("plan_name", { length: 255 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("ACTIVE").notNull(), // "ACTIVE", "TRIAL", "CANCELLED", "PAST_DUE"
    billingCycle: (0, pg_core_1.varchar)("billing_cycle", { length: 50 }).default("MONTHLY").notNull(), // "MONTHLY", "ANNUAL", "TRIAL_7_DAYS"
    amount: (0, pg_core_1.numeric)("amount", { precision: 12, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)("currency", { length: 10 }).default("INR").notNull(),
    currentPeriodStart: (0, pg_core_1.timestamp)("current_period_start", { withTimezone: true }).defaultNow().notNull(),
    currentPeriodEnd: (0, pg_core_1.timestamp)("current_period_end", { withTimezone: true }).notNull(),
    razorpaySubscriptionId: (0, pg_core_1.varchar)("razorpay_subscription_id", { length: 100 }),
    razorpayCustomerId: (0, pg_core_1.varchar)("razorpay_customer_id", { length: 100 }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
// 2. Payments & Transactions Table
exports.payments = (0, pg_core_1.pgTable)("payments", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    subscriptionId: (0, pg_core_1.uuid)("subscription_id").references(() => exports.subscriptions.id, { onDelete: "set null" }),
    orderId: (0, pg_core_1.varchar)("order_id", { length: 100 }).notNull(), // Razorpay order_xxx
    paymentId: (0, pg_core_1.varchar)("payment_id", { length: 100 }), // Razorpay pay_xxx
    amount: (0, pg_core_1.numeric)("amount", { precision: 12, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)("currency", { length: 10 }).default("INR").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("CREATED").notNull(), // "CREATED", "AUTHORIZED", "CAPTURED", "FAILED", "REFUNDED"
    method: (0, pg_core_1.varchar)("method", { length: 50 }), // "card", "upi", "netbanking", "wallet"
    receiptNumber: (0, pg_core_1.varchar)("receipt_number", { length: 100 }),
    razorpaySignature: (0, pg_core_1.varchar)("razorpay_signature", { length: 255 }),
    notes: (0, pg_core_1.jsonb)("notes").default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
// 3. Payment Webhooks Audit & Idempotency Table
exports.paymentWebhooks = (0, pg_core_1.pgTable)("payment_webhooks", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    eventId: (0, pg_core_1.varchar)("event_id", { length: 150 }).notNull().unique(), // Razorpay unique event ID
    eventType: (0, pg_core_1.varchar)("event_type", { length: 100 }).notNull(), // "payment.captured", "payment.failed", etc.
    payload: (0, pg_core_1.jsonb)("payload").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("PROCESSED").notNull(), // "PROCESSED", "IGNORED", "FAILED"
    error: (0, pg_core_1.text)("error"),
    processedAt: (0, pg_core_1.timestamp)("processed_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
});
//# sourceMappingURL=billing.js.map