async function run() {
  try {
    console.log("1. GET /api/v1/planning/processing-batches...");
    const getRes = await fetch("http://localhost:4000/api/v1/planning/processing-batches");
    console.log("GET Output:", JSON.stringify(await getRes.json(), null, 2));

    console.log("\n2. POST /api/v1/planning/processing-batches (Creating fresh processing batch in DB)...");
    const postRes = await fetch("http://localhost:4000/api/v1/planning/processing-batches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        batchNumber: "BAT-2026-JUICE-99",
        tankNumber: "Tank-02",
        targetVolume: 10000,
        uom: "Liters",
        recipeVersion: "R2 (Aseptic Blend)"
      })
    });
    console.log("POST Output:", await postRes.json());

    console.log("\n3. GET /api/v1/planning/processing-batches AFTER POST...");
    const getRes2 = await fetch("http://localhost:4000/api/v1/planning/processing-batches");
    console.log("GET Output after post:", JSON.stringify(await getRes2.json(), null, 2));

  } catch (err) {
    console.error("Test Error:", err);
  }
}

run();
