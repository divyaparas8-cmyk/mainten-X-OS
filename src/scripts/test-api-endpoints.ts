// Using global native fetch

async function testEndpoints() {
  console.log("=== TESTING LIVE FASTIFY API ENDPOINTS ===");

  const endpoints = [
    { name: "Health Check", url: "http://localhost:4000/health" },
    { name: "Warehouse Lots", url: "http://localhost:4000/api/v1/warehouse/lots" },
    { name: "Warehouse Transactions", url: "http://localhost:4000/api/v1/warehouse/transactions" },
    { name: "Production Orders", url: "http://localhost:4000/api/v1/production/orders" },
    { name: "Production Batches", url: "http://localhost:4000/api/v1/production/batches" },
    { name: "QA Release Queue", url: "http://localhost:4000/api/v1/quality/release/queue" },
    { name: "Maintenance Work Orders", url: "http://localhost:4000/api/v1/maintenance/work-orders" },
    { name: "Master Data Routings", url: "http://localhost:4000/api/v1/master-data/routings" },
    { name: "Planning Customer Orders", url: "http://localhost:4000/api/v1/planning/demand/orders" },
    { name: "Planning APS Schedules", url: "http://localhost:4000/api/v1/planning/aps/schedules" },
    { name: "Planning MRP Requirements", url: "http://localhost:4000/api/v1/planning/mrp/net-requirements" },
  ];

  // Obtain real token
  const loginRes = await fetch("http://localhost:4000/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@maintenx.com", password: "Password@123" })
  });
  const loginJson = (await loginRes.json()) as any;
  const token = loginJson?.data?.token;
  console.log("Logged in as admin! Token acquired.");

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const text = await res.text();
      let statusIcon = res.status === 200 ? "✅" : "❌";
      console.log(`${statusIcon} [${res.status}] ${ep.name} (${ep.url})`);
      if (res.status !== 200) {
        console.log(`   Response: ${text.slice(0, 200)}`);
      } else {
        const json = JSON.parse(text);
        const count = Array.isArray(json.data) ? json.data.length : (json.data ? "object" : "null");
        console.log(`   Success: data count = ${count}`);
      }
    } catch (err: any) {
      console.error(`❌ Connection error for ${ep.name}:`, err.message);
    }
  }
}

testEndpoints();
