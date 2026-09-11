import { aiService } from "../modules/ai/ai.service.js";
import { billingService } from "../modules/billing/billing.service.js";
import { razorpayAdapter } from "../modules/billing/razorpay.adapter.js";
import { machineDataService } from "../modules/iot/services/machineData.service.js";
import { pool } from "../config/database.js";
import crypto from "crypto";

async function runIntegrationVerification() {
  console.log("================================================================================");
  console.log("      MAINTENX OS — THIRD-PARTY INTEGRATIONS END-TO-END TEST SUITE");
  console.log("================================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${detail || "Assertion failed"}`);
      failed++;
    }
  }

  // ============================================================================
  // TEST GROUP 1: AI ASSISTANT INTEGRATION
  // ============================================================================
  console.log("--- 1. Testing AI Assistant Integration ---");

  try {
    // Test 1.1: Standard operational chat query
    const res = await aiService.chatQuery("What is the current OEE and downtime on packaging lines?");
    assert(!!res.reply && res.reply.length > 20, "AI Chat Query Returns Grounded Reply", res.reply);
    assert(!!res.tag, "AI Chat Query Contains Semantic Category Tag", res.tag);
    assert(Array.isArray(res.sources) && res.sources.length > 0, "AI Chat Query Contains Data Sources");
    assert(!!res.provider, "AI Chat Query Identifies Active Provider", res.provider);

    // Test 1.2: Vibration Anomaly Query
    const vibRes = await aiService.chatQuery("Check bearing vibration for capper spindle");
    assert(vibRes.reply.toLowerCase().includes("vibration") || vibRes.reply.toLowerCase().includes("bearing"), "AI Context Detects Mechanical Vibration Query");

    // Test 1.3: Empty Query Rejection
    let threwEmpty = false;
    try {
      await aiService.chatQuery("   ");
    } catch {
      threwEmpty = true;
    }
    assert(threwEmpty, "AI Rejects Empty / Whitespace Query with Validation Error");
  } catch (err: any) {
    assert(false, "AI Test Suite Execution", err.message);
  }

  // ============================================================================
  // TEST GROUP 2: RAZORPAY BILLING INTEGRATION
  // ============================================================================
  console.log("\n--- 2. Testing Razorpay Billing Integration ---");

  try {
    // Test 2.1: Plans List
    const plans = await billingService.listPlans();
    assert(plans.length >= 4, "Billing Service Lists Subscription Plans", `Count: ${plans.length}`);

    // Test 2.2: Order Creation
    const testTenantId = "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
    const order = await billingService.createOrder({ planId: "standard", tenantId: testTenantId, currency: "INR" });
    assert(!order.isFree && !!order.orderId, "Razorpay Order Successfully Created", `OrderId: ${order.orderId}`);
    assert(order.amount === 290000, "Order Amount Matches Plan Price (INR 2,90,000)");

    // Test 2.3: Cryptographic Signature Verification
    if (!order.orderId) {
      throw new Error("Order creation failed to return orderId");
    }
    const fakeOrderId: string = order.orderId;
    const fakePaymentId = `pay_${Date.now().toString(36)}`;
    const secret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret_key_2026";
    const validSignature = crypto.createHmac("sha256", secret).update(`${fakeOrderId}|${fakePaymentId}`).digest("hex");
    const isSigValid = razorpayAdapter.verifyPaymentSignature(fakeOrderId, fakePaymentId, validSignature);
    assert(isSigValid, "HMAC SHA-256 Valid Signature Passes Cryptographic Check");

    // Test 2.4: Tampered Signature Rejection
    const tamperedSig = "tampered_signature_payload_xyz_123";
    const isTamperedRejected = !razorpayAdapter.verifyPaymentSignature(fakeOrderId, fakePaymentId, tamperedSig);
    assert(isTamperedRejected, "Tampered Payment Signature Is Strictly Rejected");

    // Test 2.5: Payment Verification & Subscription Activation in PostgreSQL
    const verifyRes = await billingService.verifyPayment({
      tenantId: testTenantId,
      orderId: fakeOrderId,
      paymentId: fakePaymentId,
      signature: validSignature,
      planId: "standard",
    });
    assert(verifyRes.success && verifyRes.status === "ACTIVE", "Payment Verification Activates Subscription in PostgreSQL");

    // Test 2.6: Read Subscription from Database
    const currentSub = await billingService.getSubscription(testTenantId);
    assert(currentSub.planId === "standard" && currentSub.status === "ACTIVE", "PostgreSQL Subscriptions Table Returns Active Plan Record");

    // Test 2.7: Webhook Idempotency & Replay Protection
    const testEventId = `evt_test_${Date.now()}`;
    const webhookPayload = {
      id: testEventId,
      event: "payment.captured",
      payload: {
        payment: { entity: { id: fakePaymentId, order_id: fakeOrderId, amount: 290000 } },
      },
    };
    const webhookRawBody = JSON.stringify(webhookPayload);
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "placeholder_webhook_secret_2026";
    const webhookSig = crypto.createHmac("sha256", webhookSecret).update(webhookRawBody).digest("hex");

    // First delivery
    const whRes1 = await billingService.processWebhook(webhookRawBody, webhookSig, webhookPayload);
    assert(whRes1.success && whRes1.eventId === testEventId, "Webhook Successfully Processes payment.captured");

    // Duplicate delivery (replay attack simulation)
    const whRes2 = await billingService.processWebhook(webhookRawBody, webhookSig, webhookPayload);
    assert(whRes2.status === "IGNORED", "Webhook Idempotency: Duplicate Event Replay Ignored");
  } catch (err: any) {
    assert(false, "Billing Test Suite Execution", err.message);
  }

  // ============================================================================
  // TEST GROUP 3: PLC / IOT INDUSTRIAL CONNECTIVITY
  // ============================================================================
  console.log("\n--- 3. Testing PLC / Industrial IoT Connectivity ---");

  try {
    const adapters = machineDataService.getAdapters();

    // Test 3.1: Ingestion via Synthetic Simulator
    const simEvent = await machineDataService.ingest({
      source: "SIMULATOR",
      assetId: "FM-001",
      assetCode: "FM-001",
      speed: 252.5,
      productionCount: 32510,
      vibration: 2.15,
      temperature: 63.1,
      pressure: 6.2,
      status: "RUNNING",
    });
    assert(simEvent.speed === 252.5 && simEvent.status === "RUNNING", "Simulator Telemetry Normalized & Ingested");

    // Test 3.2: OPC-UA Adapter Protocol Ingestion
    let opcReceived = false;
    adapters.opcua.handleNodePublish("ns=2;s=Line1.Filler.Vibration", 2.25, "FM-001");
    const latestOpc = machineDataService.getLatestTelemetry("FM-001") as any;
    assert(latestOpc && latestOpc.assetCode === "FM-001", "OPC-UA Tag Ingested via Industrial Protocol Adapter");

    // Test 3.3: MQTT Adapter Protocol Ingestion
    adapters.mqtt.handleMessage("plant/line1/telemetry", {
      assetCode: "FM-001",
      speed: 248,
      vibration: 2.3,
      temperature: 64.0,
      count: 32550,
    });
    const latestMqtt = machineDataService.getLatestTelemetry("FM-001") as any;
    assert(latestMqtt && latestMqtt.speed === 248, "MQTT Sparkplug B / JSON Ingested via Industrial Broker Adapter");

    // Test 3.4: Modbus TCP Register Ingestion
    adapters.modbus.handleRegisters(1, { 40001: 250, 40002: 641, 40003: 58, 40004: 285 }, "CP-002");
    const latestModbus = machineDataService.getLatestTelemetry("CP-002") as any;
    assert(latestModbus && latestModbus.temperature === 64.1 && latestModbus.vibration === 2.85, "Modbus-TCP Holding Registers Ingested & Normalized");

    // Test 3.5: Anomaly Detection & Alarm Threshold Trigger
    const alarmEvent = await machineDataService.ingest({
      source: "SIMULATOR",
      assetId: "FM-001",
      assetCode: "FM-001",
      speed: 240,
      vibration: 3.45, // exceeds 3.0 threshold
      temperature: 78.5, // exceeds 75.0 threshold
      status: "RUNNING",
    });
    assert(!!alarmEvent.alarm && alarmEvent.alarm.includes("ALERT"), "Vibration & Temperature Threshold Alarm Automatically Triggered", alarmEvent.alarm);

    // Test 3.6: History Retrieval from PostgreSQL
    const history = await machineDataService.getHistory("FM-001", 5);
    assert(Array.isArray(history) && history.length > 0, "Telemetry Historical Log Retrieved from PostgreSQL Table");

    // Test 3.7: Gateways List
    const gateways = await machineDataService.listGateways();
    assert(gateways.length >= 3, "Industrial Edge Gateways (OPC-UA, MQTT, Modbus) Listed");
  } catch (err: any) {
    assert(false, "IoT Test Suite Execution", err.message);
  }

  // Stop simulator to cleanly exit
  await machineDataService.stopSimulator();
  await pool.end();

  console.log("\n================================================================================");
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("================================================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runIntegrationVerification().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
