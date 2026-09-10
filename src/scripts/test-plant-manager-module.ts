const BASE_URL = "http://localhost:4000/api/v1";

async function runPlantManagerTests() {
  console.log("==========================================================================");
  console.log("🚀 STARTING COMPLETE PLANT MANAGER BACKEND SUITE VERIFICATION (38 ENDPOINTS)");
  console.log("==========================================================================");

  // 1. Authenticate as admin
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@maintenx.com", password: "Password@123" }),
  });
  const loginJson = (await loginRes.json()) as any;
  const token = loginJson?.data?.token;
  if (!token) {
    throw new Error(`Authentication failed: ${JSON.stringify(loginJson)}`);
  }
  console.log("✅ [AUTH] Bearer JWT successfully acquired.");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  let passed = 0;
  let failed = 0;

  async function testEndpoint(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // --- 1. DASHBOARDS ---
  console.log("\n--- 1. DASHBOARDS & EXECUTIVE SCORECARD ---");

  await testEndpoint("GET /dashboards/command-center (Plant Manager Overview)", async () => {
    const res = await fetch(`${BASE_URL}/dashboards/command-center?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.hbSummary || !json.data?.pillars || !json.data?.hourlyLedger) {
      throw new Error(`Invalid command center response: ${JSON.stringify(json)}`);
    }
  });

  await testEndpoint("GET /dashboards/kpis (Executive KPI Analytics Scorecard)", async () => {
    const res = await fetch(`${BASE_URL}/dashboards/kpis?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !Array.isArray(json.data) || json.data.length < 6) {
      throw new Error(`Expected at least 6 executive KPIs: ${JSON.stringify(json)}`);
    }
  });

  // --- 2. PLANNING ---
  console.log("\n--- 2. MASTER PRODUCTION SCHEDULE & PLANNING ---");

  let createdScheduleId = "";
  await testEndpoint("GET /planning/schedule (List MPS Schedules)", async () => {
    const res = await fetch(`${BASE_URL}/planning/schedule?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !Array.isArray(json.data)) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("POST /planning/schedule (Create Scheduled Run)", async () => {
    const res = await fetch(`${BASE_URL}/planning/schedule`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        sku: "500ml Sparkling Lemon Test",
        line: "Line 1 — Aseptic Bottling",
        quantity: 25000,
        startTime: "16:00",
        endTime: "22:00",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.id) throw new Error(JSON.stringify(json));
    createdScheduleId = json.data.id;
  });

  await testEndpoint("PATCH /planning/schedule/:id/lock (Toggle Lock State)", async () => {
    const res = await fetch(`${BASE_URL}/planning/schedule/${createdScheduleId}/lock`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ locked: true }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.locked !== true) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("DELETE /planning/schedule/:id (Delete Schedule Run)", async () => {
    const res = await fetch(`${BASE_URL}/planning/schedule/${createdScheduleId}`, {
      method: "DELETE",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.deleted) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("GET /planning/capacity (Line Capacity Utilization)", async () => {
    const res = await fetch(`${BASE_URL}/planning/capacity?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !Array.isArray(json.data) || json.data.length === 0) throw new Error(JSON.stringify(json));
  });

  let createdConstraintId = "";
  await testEndpoint("GET /planning/constraints (List Finite Constraints)", async () => {
    const res = await fetch(`${BASE_URL}/planning/constraints?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !Array.isArray(json.data)) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("POST /planning/constraints (Create Planning Constraint)", async () => {
    const res = await fetch(`${BASE_URL}/planning/constraints`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        type: "Tooling Availability",
        description: "Rotary capper torque chucks re-coating maintenance",
        line: "Line 1 — Aseptic Bottling",
        impact: "Requires 1.5 hr setup shift",
        risk: "Medium",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.id) throw new Error(JSON.stringify(json));
    createdConstraintId = json.data.id;
  });

  await testEndpoint("PATCH /planning/constraints/:id/resolve (Resolve Constraint)", async () => {
    const res = await fetch(`${BASE_URL}/planning/constraints/${createdConstraintId}/resolve`, {
      method: "PATCH",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.status !== "Resolved") throw new Error(JSON.stringify(json));
  });

  await testEndpoint("DELETE /planning/constraints/:id (Delete Constraint)", async () => {
    const res = await fetch(`${BASE_URL}/planning/constraints/${createdConstraintId}`, {
      method: "DELETE",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.deleted) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("POST /planning/recovery/apply (Execute Recovery Simulator)", async () => {
    const res = await fetch(`${BASE_URL}/planning/recovery/apply`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        speedBoostPercent: 5,
        overtimeHours: 2,
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.projectedRecoveryUnits || !json.data?.feasibilityPercent) {
      throw new Error(JSON.stringify(json));
    }
  });

  // --- 3. PRODUCTION & OPERATIONS ---
  console.log("\n--- 3. PRODUCTION & SHOP FLOOR OPERATIONS ---");

  let createdOrderId = "";
  await testEndpoint("GET /production/orders (List Orders)", async () => {
    const res = await fetch(`${BASE_URL}/production/orders?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !Array.isArray(json.data)) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("POST /production/orders (Create Production Order)", async () => {
    const res = await fetch(`${BASE_URL}/production/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        orderNumber: `PO-TEST-${Date.now().toString().slice(-4)}`,
        targetQuantity: 20000,
        priority: "Normal",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.order?.id) throw new Error(JSON.stringify(json));
    createdOrderId = json.data.order.id;
  });

  await testEndpoint("PATCH /production/orders/:id/status (Advance Order Status)", async () => {
    const res = await fetch(`${BASE_URL}/production/orders/${createdOrderId}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: "RUNNING" }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.status !== "RUNNING") throw new Error(JSON.stringify(json));
  });

  let testBatchId = "";
  await testEndpoint("GET /production/batches (List eBR Batches)", async () => {
    const res = await fetch(`${BASE_URL}/production/batches`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !Array.isArray(json.data) || json.data.length === 0) throw new Error(JSON.stringify(json));
    testBatchId = json.data[0].id;
  });

  await testEndpoint("POST /production/batches/:id/verify-lot (Lot Barcode Scan)", async () => {
    const res = await fetch(`${BASE_URL}/production/batches/${testBatchId}/verify-lot`, {
      method: "POST",
      headers,
      body: JSON.stringify({ lotNo: "LOT-CITRIC-4401" }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.verified) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("POST /production/batches/:id/steps (Advance eBR Step)", async () => {
    const res = await fetch(`${BASE_URL}/production/batches/${testBatchId}/steps`, {
      method: "POST",
      headers,
      body: JSON.stringify({ stepNumber: 2, parameters: { tareWeightKg: 450.5 } }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.currentStep) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("PATCH /production/batches/:id/complete (Complete Batch)", async () => {
    const res = await fetch(`${BASE_URL}/production/batches/${testBatchId}/complete`, {
      method: "PATCH",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.status !== "Completed") throw new Error(JSON.stringify(json));
  });

  await testEndpoint("POST /production/batches/:id/qa-release (Release Batch to QA)", async () => {
    const res = await fetch(`${BASE_URL}/production/batches/${testBatchId}/qa-release`, {
      method: "POST",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.status !== "Released") throw new Error(JSON.stringify(json));
  });

  await testEndpoint("GET /production/hb-logs (List Hour-by-Hour Pitch Logs)", async () => {
    const res = await fetch(`${BASE_URL}/production/hb-logs?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !Array.isArray(json.data) || json.data.length === 0) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("POST /production/hb-logs (Log Pitch Hour Entry)", async () => {
    const res = await fetch(`${BASE_URL}/production/hb-logs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        hourWindow: "14:00 - 15:00",
        targetUnits: 3000,
        actualUnits: 3080,
        varianceReason: "Smooth high-speed run",
        correctiveAction: "Maintain nominal pace",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.pitchId) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("GET /production/oee (OEE & Six Big Losses Breakdown)", async () => {
    const res = await fetch(`${BASE_URL}/production/oee?plantId=PLT-01&period=daily`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.overallOEE || !json.data?.sixBigLosses) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("GET /production/performance (SMED Changeover & Micro-Stops)", async () => {
    const res = await fetch(`${BASE_URL}/production/performance?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.changeoverData || !json.data?.microStops) throw new Error(JSON.stringify(json));
  });

  let machineCode = "";
  await testEndpoint("GET /production/machines (List Floor Machine Telemetry)", async () => {
    const res = await fetch(`${BASE_URL}/production/machines?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !Array.isArray(json.data) || json.data.length === 0) throw new Error(JSON.stringify(json));
    machineCode = json.data[0].id;
  });

  await testEndpoint("PATCH /production/machines/:id/status (Toggle Machine Status)", async () => {
    const res = await fetch(`${BASE_URL}/production/machines/${machineCode}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: "STOPPED" }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.status !== "STOPPED") throw new Error(JSON.stringify(json));
  });

  await testEndpoint("GET /production/shift-handoffs (List Shift Handoffs)", async () => {
    const res = await fetch(`${BASE_URL}/production/shift-handoffs?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !Array.isArray(json.data)) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("POST /production/shift-handoffs (Record Shift Handoff)", async () => {
    const res = await fetch(`${BASE_URL}/production/shift-handoffs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        shiftFrom: "Shift B",
        shiftTo: "Shift C",
        supervisor: "Chloe Dupuis",
        unitsProduced: 46800,
        scrapUnits: 410,
        notes: "Shift handoff completed cleanly. Line 1 CIP cycle queued.",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.id) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("GET /production/shift-performance (Multi-Shift Comparison)", async () => {
    const res = await fetch(`${BASE_URL}/production/shift-performance?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.shiftA) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("GET /production/downtime (List Downtime Stoppages)", async () => {
    const res = await fetch(`${BASE_URL}/production/downtime?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !Array.isArray(json.data)) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("POST /production/downtime (Log Downtime Event)", async () => {
    const res = await fetch(`${BASE_URL}/production/downtime`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        reason: "Seamer belt friction slippage",
        durationMins: 15,
        comments: "Tightened tensioner pulley on Line 2",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.id) throw new Error(JSON.stringify(json));
  });

  // --- 4. EXCEPTION CONTROL TOWER ---
  console.log("\n--- 4. EXCEPTION CONTROL TOWER ---");

  let createdExceptionId = "";
  await testEndpoint("GET /exceptions (List Control Tower Exceptions)", async () => {
    const res = await fetch(`${BASE_URL}/exceptions?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !Array.isArray(json.data)) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("POST /exceptions (Log New Exception Alert)", async () => {
    const res = await fetch(`${BASE_URL}/exceptions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: "Line 3 Capper Torque Out-of-Spec Warning",
        severity: "P2",
        category: "Quality Deviation",
        assetOrOrder: "MC-PACK-03",
        impactDescription: "Torque sensor showed 14 in-lbs vs 18 in-lbs target.",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.id) throw new Error(JSON.stringify(json));
    createdExceptionId = json.data.id;
  });

  await testEndpoint("GET /exceptions/:id (Exception Details)", async () => {
    const res = await fetch(`${BASE_URL}/exceptions/${createdExceptionId}`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.title) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("PATCH /exceptions/:id/assign (Assign & Escalate)", async () => {
    const res = await fetch(`${BASE_URL}/exceptions/${createdExceptionId}/assign`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        owner: "Marcus Vance (Maint Lead)",
        escalationLevel: "L2 - Engineering",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.owner !== "Marcus Vance (Maint Lead)") throw new Error(JSON.stringify(json));
  });

  await testEndpoint("PATCH /exceptions/:id/resolve (Resolve Exception)", async () => {
    const res = await fetch(`${BASE_URL}/exceptions/${createdExceptionId}/resolve`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        resolutionNotes: "Calibrated pneumatic chuck torque pressure regulator and verified 10 bottle caps.",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.status !== "Resolved") throw new Error(JSON.stringify(json));
  });

  // --- 5. AI ANALYTICS ---
  console.log("\n--- 5. AI OPERATIONS INTELLIGENCE ---");

  let testAiId = "";
  await testEndpoint("GET /ai/insights (List AI Insights)", async () => {
    const res = await fetch(`${BASE_URL}/ai/insights`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !Array.isArray(json.data) || json.data.length === 0) throw new Error(JSON.stringify(json));
    testAiId = json.data[0].id;
  });

  await testEndpoint("POST /ai/insights/:id/approve (Approve Insight)", async () => {
    const res = await fetch(`${BASE_URL}/ai/insights/${testAiId}/approve`, {
      method: "POST",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.status !== "Approved") throw new Error(JSON.stringify(json));
  });

  await testEndpoint("POST /ai/insights/:id/reject (Reject Insight)", async () => {
    const res = await fetch(`${BASE_URL}/ai/insights/${testAiId}/reject`, {
      method: "POST",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.status !== "Rejected") throw new Error(JSON.stringify(json));
  });

  await testEndpoint("POST /ai/chat (Operational AI Chat Assistant)", async () => {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({ query: "What is current plant OEE and any downtime on Line 1?" }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.reply || !json.data?.tag) throw new Error(JSON.stringify(json));
  });

  console.log("\n==========================================================================");
  console.log(`🏁 TEST RESULTS: ${passed} PASSED / ${failed} FAILED (${passed + failed} TOTAL)`);
  console.log("==========================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runPlantManagerTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
