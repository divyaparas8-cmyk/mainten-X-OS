"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Quick test for the /admin/users/provision endpoint
 */
const BASE = "http://localhost:4000/api/v1";
async function main() {
    // Login
    const loginRes = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@maintenx.com", password: "Password@123" })
    });
    const loginData = await loginRes.json();
    const token = loginData?.data?.token;
    console.log("Login status:", loginRes.status, "| Token:", token ? "OK" : "FAILED");
    // Test provision with unique email
    const email = `test.${Date.now()}@testco.com`;
    const provRes = await fetch(`${BASE}/admin/users/provision`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
            name: "Test Engineer",
            email,
            role: "Maintenance Lead",
            department: "Maintenance",
            plant: "Indore Mega Facility",
            status: "Active"
        })
    });
    const provData = await provRes.json();
    console.log("\nProvision NEW user → HTTP", provRes.status);
    console.log(JSON.stringify(provData, null, 2));
    // Test provision with SAME email (should 409)
    const provRes2 = await fetch(`${BASE}/admin/users/provision`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
            name: "Test Engineer Duplicate",
            email,
            role: "Plant Manager",
            department: "Operations",
            plant: "Indore Mega Facility",
            status: "Active"
        })
    });
    const provData2 = await provRes2.json();
    console.log("\nProvision DUPLICATE user → HTTP", provRes2.status, "(expected 409)");
    console.log(JSON.stringify(provData2, null, 2));
}
main().catch(console.error);
//# sourceMappingURL=test-provision.js.map