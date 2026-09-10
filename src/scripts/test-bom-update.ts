/**
 * Test PUT /master-data/boms/:id (Save Changes)
 */
const BASE = "http://localhost:4000/api/v1";

async function main() {
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@maintenx.com", password: "Password@123" })
  });
  const token = (await loginRes.json() as any)?.data?.token;
  console.log("Login:", loginRes.status);

  // GET boms to find first one
  const bomsRes = await fetch(`${BASE}/master-data/boms`, { headers: { Authorization: `Bearer ${token}` } });
  const bomsData: any = await bomsRes.json();
  const firstBom = (bomsData?.data || bomsData)?.[0];
  console.log("\nFirst BOM:", firstBom?.id, firstBom?.name || firstBom?.bomNumber);

  // Test PUT (Save Changes)
  const bomId = firstBom?.id || "BOM-5001";
  const putRes = await fetch(`${BASE}/master-data/boms/${bomId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      batchSize: "20000",
      yieldTarget: "99.4%",
      components: []
    })
  });
  const putData: any = await putRes.json();
  console.log("\nPUT /boms/:id →", putRes.status, putRes.status === 200 ? "✅ OK" : "❌ FAIL");
  console.log(JSON.stringify(putData, null, 2));

  // Test POST (Create BOM)  
  const postRes = await fetch(`${BASE}/master-data/boms`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      bomNumber: `BOM-TEST-${Date.now()}`,
      finishedSkuId: "SKU-001",
      batchSize: "10000",
      yieldTarget: "99.0%"
    })
  });
  const postData: any = await postRes.json();
  console.log("\nPOST /boms →", postRes.status, postRes.status === 201 ? "✅ OK" : "❌ FAIL");
  console.log(JSON.stringify(postData?.data || postData, null, 2));
}

main().catch(console.error);
