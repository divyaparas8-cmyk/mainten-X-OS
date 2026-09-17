async function run() {
  try {
    console.log("1. GET /api/v1/dashboards/operator/profile...");
    const getRes = await fetch("http://localhost:4000/api/v1/dashboards/operator/profile");
    console.log("GET Output:", await getRes.json());

    console.log("\n2. PUT /api/v1/dashboards/operator/profile (Updating Name, Email & Phone)...");
    const putRes = await fetch("http://localhost:4000/api/v1/dashboards/operator/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Hitesha Borase",
        email: "hitesha@maintenx.io",
        phone: "+91 9876543210",
        plant: "xyz Main Site",
        shift: "Shift A (06:00 - 14:00)"
      })
    });
    console.log("PUT Output:", await putRes.json());

    console.log("\n3. GET /api/v1/dashboards/operator/profile AFTER UPDATE...");
    const getRes2 = await fetch("http://localhost:4000/api/v1/dashboards/operator/profile");
    console.log("GET After Update Output:", await getRes2.json());
  } catch (err) {
    console.error("Test Error:", err);
  }
}

run();
