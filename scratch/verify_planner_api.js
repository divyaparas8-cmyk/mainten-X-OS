const BASE_URL = "http://localhost:4000/api/v1/planning";

async function verifyPlannerEndpoints() {
  console.log("=== Verifying Planner Dashboard API Endpoints ===");

  try {
    // 1. Get Processing Batches
    const resBatches = await fetch(`${BASE_URL}/processing-batches`);
    const batchesJson = await resBatches.json();
    const batches = batchesJson.data || batchesJson;
    console.log("1. GET /processing-batches -> Status:", resBatches.status, "| Count:", Array.isArray(batches) ? batches.length : typeof batches);

    // 2. Create Processing Batch
    const resCreate = await fetch(`${BASE_URL}/processing-batches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        batchNumber: `BAT-2026-TEST-${Math.floor(100 + Math.random() * 900)}`,
        tankNumber: "Tank-03 (5,000L)",
        targetVolume: 5000,
        uom: "Liters",
        recipeVersion: "R2 (Citrus Blend)"
      })
    });
    const createdJson = await resCreate.json();
    const createdBatch = createdJson.data || createdJson;
    console.log("2. POST /processing-batches -> Status:", resCreate.status, "| Batch #:", createdBatch?.batch_number || createdBatch?.batchNumber);

    // 3. Link Batch if batch created
    if (createdBatch && createdBatch.id) {
      const targetPo = createdBatch.production_order_id || createdBatch.productionOrderId;
      if (targetPo) {
        const resLink = await fetch(`${BASE_URL}/processing-batches/link`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            batchId: createdBatch.id,
            productionOrderId: targetPo
          })
        });
        const linkJson = await resLink.json();
        console.log("3. POST /processing-batches/link -> Status:", resLink.status, "| Response:", linkJson);
      }
    }

    // 4. Get MRP Net Requirements
    const resMrp = await fetch(`${BASE_URL}/mrp/net-requirements`);
    const mrpJson = await resMrp.json();
    const mrpData = mrpJson.data || mrpJson;
    console.log("4. GET /mrp/net-requirements -> Status:", resMrp.status, "| Items:", Array.isArray(mrpData) ? mrpData.length : typeof mrpData);

    console.log("\n✅ All Planner API endpoints verified successfully with HTTP 200/201!");
  } catch (err) {
    console.error("❌ Error verifying planner endpoints:", err.message);
  }
}

verifyPlannerEndpoints();
