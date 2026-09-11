"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Test: PUT /master-data/skus/:id
 */
const BASE = "http://localhost:4000/api/v1";
async function main() {
    const loginRes = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@maintenx.com", password: "Password@123" })
    });
    const loginData = await loginRes.json();
    const token = loginData?.data?.token;
    console.log("Login:", loginRes.status, token ? "OK" : "FAIL");
    // GET skus to find one
    const skuRes = await fetch(`${BASE}/master-data/skus`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const skuData = await skuRes.json();
    const firstSku = skuData?.data?.[0] || skuData?.[0];
    console.log("\nFirst SKU:", JSON.stringify(firstSku, null, 2));
    if (!firstSku) {
        console.log("No SKUs found");
        return;
    }
    const skuId = firstSku.skuId || firstSku.id;
    console.log("\nUpdating SKU ID:", skuId);
    // PUT update
    const updateRes = await fetch(`${BASE}/master-data/skus/${skuId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
            name: firstSku.name + " (Updated)",
            category: firstSku.category || "Finished Goods",
            uom: firstSku.uom || "Units",
            description: "Updated via API test",
            status: "Active"
        })
    });
    const updateData = await updateRes.json();
    console.log("\nPUT /skus/:id →", updateRes.status);
    console.log(JSON.stringify(updateData, null, 2));
}
main().catch(console.error);
//# sourceMappingURL=test-sku-update.js.map