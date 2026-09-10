const BASE_URL = "http://localhost:4000/api/v1";

async function runTests() {
  console.log("==================================================================");
  console.log("🚀 STARTING COMPLETE CI / ENGINEERING BACKEND INTEGRATION TEST SUITE");
  console.log("==================================================================");

  // 1. Authenticate
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

  // 2. Executive Dashboard
  await testEndpoint("GET /ci/dashboard/summary", async () => {
    const res = await fetch(`${BASE_URL}/ci/dashboard/summary?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.financials || !json.data?.reliability) {
      throw new Error(`Invalid dashboard summary response: ${JSON.stringify(json)}`);
    }
  });

  // 3. RCA Investigations Hub
  let testRcaId = "";
  await testEndpoint("GET /ci/rca/investigations", async () => {
    const res = await fetch(`${BASE_URL}/ci/rca/investigations?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !Array.isArray(json.data)) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("POST /ci/rca/investigations (Create)", async () => {
    const res = await fetch(`${BASE_URL}/ci/rca/investigations`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: "Test Investigation — Pneumatic Pressure Collapse",
        assetId: "AST-002",
        assetName: "HTST Flash Pasteurizer",
        lineId: "LIN-02",
        lineName: "Line 2 — Formulation",
        plantId: "PLT-01",
        problemStatement: "Actuator diaphragm failure under thermal CIP.",
        severity: "Critical",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.id) throw new Error(JSON.stringify(json));
    testRcaId = json.data.id;
  });

  await testEndpoint("POST /ci/rca/investigations/:id/phase (Advance to CAPA)", async () => {
    const res = await fetch(`${BASE_URL}/ci/rca/investigations/${testRcaId}/phase`, {
      method: "POST",
      headers,
      body: JSON.stringify({ phase: "Occurrence Cause" }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.currentPhase !== "Occurrence Cause") throw new Error(JSON.stringify(json));
  });

  await testEndpoint("GET /ci/rca/summary", async () => {
    const res = await fetch(`${BASE_URL}/ci/rca/summary?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.total === undefined) throw new Error(JSON.stringify(json));
  });

  // 4. Evidence Locker
  let testEvidenceId = "";
  await testEndpoint("POST /ci/rca/evidence (Create)", async () => {
    const res = await fetch(`${BASE_URL}/ci/rca/evidence`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        rcaId: testRcaId,
        type: "SCADA Trend",
        title: "Steam Manifold Pressure Plunge",
        details: "Pressure plunged from 6.2 bar to 2.8 bar.",
        uploadedBy: "Marcus Vance",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.id) throw new Error(JSON.stringify(json));
    testEvidenceId = json.data.id;
  });

  await testEndpoint("GET /ci/rca/evidence?rcaId=...", async () => {
    const res = await fetch(`${BASE_URL}/ci/rca/evidence?rcaId=${testRcaId}`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !Array.isArray(json.data) || json.data.length === 0) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("DELETE /ci/rca/evidence/:id", async () => {
    const res = await fetch(`${BASE_URL}/ci/rca/evidence/${testEvidenceId}`, {
      method: "DELETE",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error(JSON.stringify(json));
  });

  // 5. Hypotheses & Validation Tests
  let testHypId = "";
  await testEndpoint("POST /ci/rca/hypotheses (Create)", async () => {
    const res = await fetch(`${BASE_URL}/ci/rca/hypotheses`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        rcaId: testRcaId,
        statement: "Actuator air pressure collapsed due to diaphragm puncture.",
        testMethod: "Perform soap bubble leak check under 4.0 bar regulator pressure.",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.id) throw new Error(JSON.stringify(json));
    testHypId = json.data.id;
  });

  await testEndpoint("POST /ci/rca/hypotheses/:id/validate", async () => {
    const res = await fetch(`${BASE_URL}/ci/rca/hypotheses/${testHypId}/validate`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        validationStatus: "Confirmed Root Cause",
        evidenceResult: "Perimeter tear confirmed at 4.0 bar.",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.validationStatus !== "Confirmed Root Cause") throw new Error(JSON.stringify(json));
  });

  await testEndpoint("DELETE /ci/rca/hypotheses/:id", async () => {
    const res = await fetch(`${BASE_URL}/ci/rca/hypotheses/${testHypId}`, {
      method: "DELETE",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error(JSON.stringify(json));
  });

  // 6. CAPA Action Items
  let testCapaId = "";
  await testEndpoint("POST /ci/capa/actions (Create)", async () => {
    const res = await fetch(`${BASE_URL}/ci/capa/actions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        rcaId: testRcaId,
        description: "Replace EPDM diaphragm with Viton High-Temp fluoroelastomer.",
        actionType: "Corrective",
        owner: "Marcus Vance",
        priority: "High",
        dueDate: "2026-09-30",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.id) throw new Error(JSON.stringify(json));
    testCapaId = json.data.id;
  });

  await testEndpoint("PATCH /ci/capa/actions/:id/status (In Progress)", async () => {
    const res = await fetch(`${BASE_URL}/ci/capa/actions/${testCapaId}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: "In Progress", evidenceNotes: "Viton kit received from stores" }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.status !== "In Progress") throw new Error(JSON.stringify(json));
  });

  await testEndpoint("POST /ci/capa/actions/:id/verify (Effectiveness)", async () => {
    const res = await fetch(`${BASE_URL}/ci/capa/actions/${testCapaId}/verify`, {
      method: "POST",
      headers,
      body: JSON.stringify({ effectivenessResult: "30-day run verified with zero leakage" }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.status !== "Verified") throw new Error(JSON.stringify(json));
  });

  await testEndpoint("DELETE /ci/capa/actions/:id", async () => {
    const res = await fetch(`${BASE_URL}/ci/capa/actions/${testCapaId}`, {
      method: "DELETE",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error(JSON.stringify(json));
  });

  // 7. Loss Analysis
  let testLossId = "";
  await testEndpoint("POST /ci/losses (Create)", async () => {
    const res = await fetch(`${BASE_URL}/ci/losses`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        category: "Downtime Loss",
        plantId: "PLT-01",
        lineId: "LIN-02",
        assetId: "AST-002",
        eventName: "Pneumatic Diaphragm Rupture",
        hoursLost: 1.5,
        unitsLost: 4500,
        financialImpactUSD: 7200,
        linkedRcaId: testRcaId,
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.id) throw new Error(JSON.stringify(json));
    testLossId = json.data.id;
  });

  await testEndpoint("GET /ci/losses/summary", async () => {
    const res = await fetch(`${BASE_URL}/ci/losses/summary?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.totalFinancialImpactUSD === undefined) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("DELETE /ci/losses/:id", async () => {
    const res = await fetch(`${BASE_URL}/ci/losses/${testLossId}`, {
      method: "DELETE",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error(JSON.stringify(json));
  });

  // 8. CI Projects & 21 CFR Part 11 Benefits
  let testProjId = "";
  await testEndpoint("POST /ci/projects (Create)", async () => {
    const res = await fetch(`${BASE_URL}/ci/projects`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "Pasteurizer Pneumatic & Thermal Upgrade",
        type: "DMAIC 6-Sigma",
        plantId: "PLT-01",
        lineId: "LIN-02",
        assetId: "AST-002",
        linkedRcaId: testRcaId,
        sponsor: "Operations Director",
        owner: "David Kim",
        projectedSavingsAnnual: 35000,
        realizedSavingsYTD: 31000,
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.id) throw new Error(JSON.stringify(json));
    testProjId = json.data.id;
  });

  await testEndpoint("POST /ci/projects/:id/verify-lock (21 CFR Part 11 GM Lock)", async () => {
    const res = await fetch(`${BASE_URL}/ci/projects/${testProjId}/verify-lock`, {
      method: "POST",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.benefitStatus !== "Verified & Locked" || !json.data?.lockedBy) {
      throw new Error(JSON.stringify(json));
    }
  });

  await testEndpoint("POST /ci/projects/:id/unlock (with Justification)", async () => {
    const res = await fetch(`${BASE_URL}/ci/projects/${testProjId}/unlock`, {
      method: "POST",
      headers,
      body: JSON.stringify({ justification: "Engineering metric audit requested recalculation" }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.benefitStatus !== "Pending Verification") throw new Error(JSON.stringify(json));
  });

  await testEndpoint("GET /ci/benefits/summary", async () => {
    const res = await fetch(`${BASE_URL}/ci/benefits/summary?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || json.data?.realizedSavingsTotal === undefined) throw new Error(JSON.stringify(json));
  });

  await testEndpoint("DELETE /ci/projects/:id", async () => {
    const res = await fetch(`${BASE_URL}/ci/projects/${testProjId}`, {
      method: "DELETE",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error(JSON.stringify(json));
  });

  // 9. Standards Library
  let testStdId = "";
  await testEndpoint("POST /ci/standards (Publish)", async () => {
    const res = await fetch(`${BASE_URL}/ci/standards`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: "SOP-ENG-501: High-Temp Pneumatic Diaphragm Inspection & Replacement",
        type: "Controlled SOP",
        version: "v1.0",
        plantId: "PLT-01",
        lineId: "LIN-02",
        assetId: "AST-002",
        owner: "Engineering Standards Committee",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.id) throw new Error(JSON.stringify(json));
    testStdId = json.data.id;
  });

  await testEndpoint("DELETE /ci/standards/:id", async () => {
    const res = await fetch(`${BASE_URL}/ci/standards/${testStdId}`, {
      method: "DELETE",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error(JSON.stringify(json));
  });

  // 10. Verified Solutions
  let testSolId = "";
  await testEndpoint("POST /ci/solutions (Publish)", async () => {
    const res = await fetch(`${BASE_URL}/ci/solutions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        assetId: "AST-002",
        assetName: "HTST Flash Pasteurizer",
        failureMode: "Diaphragm Puncture under CIP",
        symptom: "Chatter on modulating valve",
        rootCause: "Thermal fatigue on EPDM",
        solutionSteps: "Replace with Viton seal kit SKU-SP-9901 and torque bonnet bolts to 12 Nm.",
        partsUsed: "Viton Seal Kit SKU-SP-9901",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.id) throw new Error(JSON.stringify(json));
    testSolId = json.data.id;
  });

  await testEndpoint("DELETE /ci/solutions/:id", async () => {
    const res = await fetch(`${BASE_URL}/ci/solutions/${testSolId}`, {
      method: "DELETE",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error(JSON.stringify(json));
  });

  // 11. Capex Projects
  let testCapexId = "";
  await testEndpoint("POST /ci/capex (Submit Proposal)", async () => {
    const res = await fetch(`${BASE_URL}/ci/capex`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "Dual-Chamber Sanitary Modulating Valve Skid",
        plantId: "PLT-01",
        lineId: "LIN-02",
        assetId: "AST-002",
        budget: 52000,
        estimatedCost: 48000,
        engineeringJustification: "Eliminates single point of failure on CCP thermal process.",
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.id) throw new Error(JSON.stringify(json));
    testCapexId = json.data.id;
  });

  await testEndpoint("DELETE /ci/capex/:id", async () => {
    const res = await fetch(`${BASE_URL}/ci/capex/${testCapexId}`, {
      method: "DELETE",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error(JSON.stringify(json));
  });

  // 12. Reliability & Bad Actors
  await testEndpoint("GET /ci/reliability", async () => {
    const res = await fetch(`${BASE_URL}/ci/reliability?plantId=PLT-01`, { headers });
    const json = (await res.json()) as any;
    if (!res.ok || !Array.isArray(json.data) || json.data.length === 0) throw new Error(JSON.stringify(json));
  });

  let badActorRcaId = "";
  await testEndpoint("POST /ci/reliability/:assetId/launch-rca (Automated Bad Actor RCA)", async () => {
    const res = await fetch(`${BASE_URL}/ci/reliability/AST-002/launch-rca`, {
      method: "POST",
      headers,
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json.data?.id || json.data?.assetId !== "AST-002") throw new Error(JSON.stringify(json));
    badActorRcaId = json.data.id;
  });

  // Clean up created test investigations
  if (testRcaId) {
    await fetch(`${BASE_URL}/ci/rca/investigations/${testRcaId}`, { method: "DELETE", headers });
  }
  if (badActorRcaId) {
    await fetch(`${BASE_URL}/ci/rca/investigations/${badActorRcaId}`, { method: "DELETE", headers });
  }

  console.log("==================================================================");
  console.log(`🏁 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("❌ Fatal test error:", err);
  process.exit(1);
});
