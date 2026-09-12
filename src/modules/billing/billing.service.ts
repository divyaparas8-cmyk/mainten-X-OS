import { db } from "../../config/database.js";
import { subscriptions, payments, paymentWebhooks, tenants } from "../../db/schema/index.js";
import { eq, desc } from "drizzle-orm";
import { razorpayAdapter } from "./razorpay.adapter.js";
import { ValidationError, NotFoundError } from "../../shared/errors/AppError.js";

export const SUBSCRIPTION_PLANS: Record<string, { id: string; name: string; price: number; currency: string; interval: string }> = {
  pilot: { id: "pilot", name: "Plant Pilot (7-Day Trial)", price: 0, currency: "INR", interval: "7_days" },
  starter: { id: "starter", name: "Individual Modules", price: 125000, currency: "INR", interval: "monthly" }, // ~$1,499 CAD approx ₹1,25,000
  standard: { id: "standard", name: "Bundles (Most Popular)", price: 290000, currency: "INR", interval: "monthly" }, // ~$3,499 CAD approx ₹2,90,000
  enterprise: { id: "enterprise", name: "MaintenX OS Complete", price: 450000, currency: "INR", interval: "monthly" }, // ~$5,499 CAD approx ₹4,50,000
};

export class BillingService {
  async listPlans() {
    return Object.values(SUBSCRIPTION_PLANS);
  }

  async createOrder(params: { planId: string; tenantId: string; currency?: string }) {
    const { planId, tenantId, currency = "INR" } = params;
    const plan = SUBSCRIPTION_PLANS[planId.toLowerCase()];

    if (!plan) {
      throw new ValidationError(`Invalid subscription plan: '${planId}'`);
    }

    // Free pilot plan requires no payment gateway order
    if (plan.price === 0) {
      return {
        isFree: true,
        planId: plan.id,
        planName: plan.name,
        amount: 0,
        currency,
        message: "Plant Pilot activated with zero payment required.",
      };
    }

    const receipt = `REC-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    // 1. Create order through Razorpay Adapter
    const rzpOrder = await razorpayAdapter.createOrder({
      amount: plan.price,
      currency,
      receipt,
      notes: {
        tenantId,
        planId: plan.id,
        planName: plan.name,
      },
    });

    // 2. Persist order in PostgreSQL payments ledger
    const [paymentRecord] = await db
      .insert(payments)
      .values({
        tenantId,
        orderId: rzpOrder.id,
        amount: String(plan.price),
        currency: currency.toUpperCase(),
        status: "CREATED",
        receiptNumber: receipt,
        notes: { planId: plan.id, planName: plan.name },
      })
      .returning();

    return {
      isFree: false,
      orderId: rzpOrder.id,
      amount: plan.price,
      currency: rzpOrder.currency,
      keyId: rzpOrder.keyId,
      receipt,
      planId: plan.id,
      planName: plan.name,
      paymentRecordId: paymentRecord?.id,
    };
  }

  async verifyPayment(params: {
    tenantId: string;
    orderId: string;
    paymentId: string;
    signature: string;
    planId: string;
  }) {
    const { tenantId, orderId, paymentId, signature, planId } = params;

    // 1. Verify Cryptographic HMAC SHA-256 Signature
    const isValid = razorpayAdapter.verifyPaymentSignature(orderId, paymentId, signature);
    if (!isValid) {
      // Record tampering/failed attempt in payments table
      await db
        .update(payments)
        .set({ status: "FAILED", updatedAt: new Date() })
        .where(eq(payments.orderId, orderId));

      throw new ValidationError("Cryptographic payment signature verification failed. Possible payload tampering.");
    }

    const plan = SUBSCRIPTION_PLANS[planId.toLowerCase()] || SUBSCRIPTION_PLANS.standard;
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days renewal

    // 2. Update Payment Record to CAPTURED
    await db
      .update(payments)
      .set({
        paymentId,
        razorpaySignature: signature,
        status: "CAPTURED",
        updatedAt: now,
      })
      .where(eq(payments.orderId, orderId));

    // 3. Upsert Active Subscription in PostgreSQL
    const [subRecord] = await db
      .insert(subscriptions)
      .values({
        tenantId,
        planId: plan.id,
        planName: plan.name,
        status: "ACTIVE",
        billingCycle: "MONTHLY",
        amount: String(plan.price),
        currency: plan.currency,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        razorpayCustomerId: `cust_${tenantId.substring(0, 8)}`,
      })
      .returning();

    // 4. Update tenant organization plan in tenants table
    await db
      .update(tenants)
      .set({
        plan: plan.name.toUpperCase().replace(/\s+/g, "_"),
        status: "ACTIVE",
        updatedAt: now,
      })
      .where(eq(tenants.id, tenantId));

    return {
      success: true,
      message: `Subscription to ${plan.name} verified and activated successfully!`,
      subscriptionId: subRecord?.id,
      orderId,
      paymentId,
      status: "ACTIVE",
      currentPeriodEnd: periodEnd.toISOString(),
    };
  }

  async processWebhook(rawBody: string, signature: string, eventPayload: any) {
    // 1. Verify webhook signature
    const isValid = razorpayAdapter.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      throw new ValidationError("Invalid Razorpay webhook signature");
    }

    const eventId = eventPayload.id || `evt_${Date.now()}`;
    const eventType = eventPayload.event || "unknown";

    // 2. Idempotency Check: Prevent duplicate webhook processing
    const existing = await db
      .select()
      .from(paymentWebhooks)
      .where(eq(paymentWebhooks.eventId, eventId))
      .limit(1);

    if (existing.length > 0) {
      console.log(`[Webhook Idempotency] Event ${eventId} already processed. Skipping.`);
      return { success: true, message: "Duplicate event already processed.", eventId, status: "IGNORED" };
    }

    // 3. Record webhook in audit log
    await db.insert(paymentWebhooks).values({
      eventId,
      eventType,
      payload: eventPayload,
      status: "PROCESSED",
    });

    // 4. Process event semantics
    const entity = eventPayload?.payload?.payment?.entity || eventPayload?.payload?.order?.entity;
    if (eventType === "payment.captured" && entity) {
      const orderId = entity.order_id;
      const paymentId = entity.id;
      if (orderId) {
        await db
          .update(payments)
          .set({
            paymentId,
            status: "CAPTURED",
            updatedAt: new Date(),
          })
          .where(eq(payments.orderId, orderId));
      }
    } else if (eventType === "payment.failed" && entity) {
      const orderId = entity.order_id;
      if (orderId) {
        await db
          .update(payments)
          .set({
            status: "FAILED",
            updatedAt: new Date(),
          })
          .where(eq(payments.orderId, orderId));
      }
    }

    return { success: true, message: `Webhook ${eventType} processed successfully.`, eventId };
  }

  async getSubscription(tenantId: string) {
    const subList = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.tenantId, tenantId))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    if (subList.length > 0) {
      return subList[0];
    }

    // Default 7-day plant pilot if no active subscription on record
    return {
      planId: "pilot",
      planName: "Plant Pilot",
      status: "TRIAL",
      billingCycle: "7_DAYS",
      amount: "0.00",
      currency: "INR",
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }
}

export const billingService = new BillingService();
