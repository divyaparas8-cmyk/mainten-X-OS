async function run() {
  try {
    console.log("1. GET /api/v1/dashboards/operator/profile before update...");
    const getRes1 = await fetch("http://localhost:4000/api/v1/dashboards/operator/profile");
    console.log("GET Output before update:", JSON.stringify(await getRes1.json(), null, 2));

    console.log("\n2. PUT /api/v1/dashboards/operator/profile (Updating Certifications list)...");
    const putRes = await fetch("http://localhost:4000/api/v1/dashboards/operator/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        certifications: [
          "OSHA 30-Hour Safety",
          "Aseptic Bottling Line Specialist",
          "SCADA PLC Troubleshooting Level 2"
        ]
      })
    });
    console.log("PUT Output:", await putRes.json());

    console.log("\n3. GET /api/v1/dashboards/operator/profile AFTER update...");
    const getRes2 = await fetch("http://localhost:4000/api/v1/dashboards/operator/profile");
    console.log("GET Output after update:", JSON.stringify(await getRes2.json(), null, 2));

  } catch (err) {
    console.error("Error:", err);
  }
}

run();
