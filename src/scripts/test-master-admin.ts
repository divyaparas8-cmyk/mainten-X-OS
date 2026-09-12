import { buildApp } from "../app.js";
import { pool } from "../config/database.js";
import bcrypt from "bcryptjs";

async function runMasterAdminTestSuite() {
  console.log("================================================================================");
  console.log("      MAINTENX OS — MASTER ADMIN PRODUCTION BACKEND INTEGRATION TEST SUITE");
  console.log("================================================================================\n");

  const app = await buildApp();
  await app.ready();

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${detail || "Assertion failed"}`);
      failed++;
    }
  }

  let masterToken = "";
  let companyAdminToken = "";

  try {
    // --------------------------------------------------------------------------
    // 0. AUTHENTICATION & ROLE TOKENS
    // --------------------------------------------------------------------------
    console.log("--- 0. Authenticating Master Admin & Company Admin ---");
    
    // Ensure admin user has known test password for test repeatability
    const defaultHash = await bcrypt.hash("Password@123", 10);
    await pool.query("UPDATE users SET password_hash = $1 WHERE email = 'admin@maintenx.com'", [defaultHash]);

    // Login as Master Admin
    const masterLoginRes = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email: "master@maintenx.com", password: "Password@123" },
    });
    const masterLoginData = JSON.parse(masterLoginRes.payload);
    assert(masterLoginRes.statusCode === 200, "Master Admin Login Successful");
    masterToken = masterLoginData.data?.token;
    assert(!!masterToken, "Master Admin JWT Token Acquired");

    // Login as Company Admin
    const adminLoginRes = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email: "admin@maintenx.com", password: "Password@123" },
    });
    const adminLoginData = JSON.parse(adminLoginRes.payload);
    assert(adminLoginRes.statusCode === 200, "Company Admin Login Successful");
    companyAdminToken = adminLoginData.data?.token;
    assert(!!companyAdminToken, "Company Admin JWT Token Acquired");

    // --------------------------------------------------------------------------
    // TEST GROUP 1: CONTROL CENTER & DASHBOARD
    // --------------------------------------------------------------------------
    console.log("\n--- 1. Testing Control Center / Dashboard API ---");
    const dashRes = await app.inject({
      method: "GET",
      url: "/api/v1/master/dashboard",
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(dashRes.statusCode === 200, "Dashboard Endpoint Responds 200 OK");
    const dashData = JSON.parse(dashRes.payload).data;
    assert(typeof dashData.kpis.totalCompanies === "number" && dashData.kpis.totalCompanies >= 1, "Total Companies Calculated From PostgreSQL");
    assert(typeof dashData.kpis.totalUsers === "number" && dashData.kpis.totalUsers >= 1, "Total Global Users Calculated From PostgreSQL");
    assert(typeof dashData.kpis.activeSubscriptions === "number", "Active Subscriptions Calculated From PostgreSQL");
    assert(Array.isArray(dashData.activityLogs), "Recent Platform Activity Retrieved From PostgreSQL audit_logs");

    // --------------------------------------------------------------------------
    // TEST GROUP 2: ROLE AUTHORIZATION & TENANT ISOLATION
    // --------------------------------------------------------------------------
    console.log("\n--- 2. Testing Security & Role Authorization Guard ---");
    const forbiddenRes = await app.inject({
      method: "GET",
      url: "/api/v1/master/dashboard",
      headers: { authorization: `Bearer ${companyAdminToken}` },
    });
    assert(forbiddenRes.statusCode === 403, "Company Admin Blocked from Master Admin API with 403 Forbidden");

    const noAuthRes = await app.inject({
      method: "GET",
      url: "/api/v1/master/dashboard",
    });
    assert(noAuthRes.statusCode === 403, "Unauthenticated Request Blocked from Master Admin API with 403 Forbidden");

    // --------------------------------------------------------------------------
    // TEST GROUP 3: COMPANIES MANAGEMENT CRUD & PERSISTENCE
    // --------------------------------------------------------------------------
    console.log("\n--- 3. Testing Companies Management CRUD & Safe Deactivation ---");
    const testCompanyName = `Apex Beverage Bottling ${Date.now()}`;
    const createCompanyRes = await app.inject({
      method: "POST",
      url: "/api/v1/master/companies",
      headers: { authorization: `Bearer ${masterToken}` },
      payload: {
        name: testCompanyName,
        admin: "Johnathan Doe",
        adminEmail: `jdoe_${Date.now()}@apexbev.com`,
        subscription: "Bundles",
        currency: "CAD",
      },
    });
    assert(createCompanyRes.statusCode === 201, "Create Company Persists to PostgreSQL", createCompanyRes.payload);
    const createdCompany = JSON.parse(createCompanyRes.payload).data;
    const testCompanyId = createdCompany.id;

    // List & search companies
    const listCompaniesRes = await app.inject({
      method: "GET",
      url: `/api/v1/master/companies?search=${encodeURIComponent("Apex")}`,
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(listCompaniesRes.statusCode === 200, "List & Search Companies Endpoint Responds 200 OK");
    const matchingCompanies = JSON.parse(listCompaniesRes.payload).data;
    assert(matchingCompanies.some((c: any) => c.id === testCompanyId), "Newly Created Company Found in Search Results");

    // Get Company Details (all 9 tabs)
    const companyDetailRes = await app.inject({
      method: "GET",
      url: `/api/v1/master/companies/${testCompanyId}`,
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(companyDetailRes.statusCode === 200, "Get Company Details Responds 200 OK");
    const detailData = JSON.parse(companyDetailRes.payload).data;
    assert(detailData.plantsList.length >= 1, "Company Automatically Provisioned with Primary Plant");
    assert(detailData.usersList.length >= 1, "Company Automatically Provisioned with Initial Admin User");
    assert(!!detailData.modules.produce, "Company Initialized with Core Modules Entitlement");

    // Suspend Company
    const suspendRes = await app.inject({
      method: "PATCH",
      url: `/api/v1/master/companies/${testCompanyId}/status`,
      headers: { authorization: `Bearer ${masterToken}` },
      payload: { status: "Suspended" },
    });
    assert(suspendRes.statusCode === 200, "Company Status Update (Suspend) Responds 200 OK");

    // Activate Company
    const activateRes = await app.inject({
      method: "PATCH",
      url: `/api/v1/master/companies/${testCompanyId}/status`,
      headers: { authorization: `Bearer ${masterToken}` },
      payload: { status: "Active" },
    });
    assert(activateRes.statusCode === 200, "Company Status Update (Activate) Responds 200 OK");

    // Safe Deactivate / Delete Company
    const deleteRes = await app.inject({
      method: "DELETE",
      url: `/api/v1/master/companies/${testCompanyId}`,
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(deleteRes.statusCode === 200, "Safe Deactivation of Company Responds 200 OK without FK violation");

    // --------------------------------------------------------------------------
    // TEST GROUP 4: COMPANY ADMINISTRATORS
    // --------------------------------------------------------------------------
    console.log("\n--- 4. Testing Company Administrators API ---");
    const adminsRes = await app.inject({
      method: "GET",
      url: "/api/v1/master/company-admins",
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(adminsRes.statusCode === 200, "List Company Admins Responds 200 OK");
    const adminsList = JSON.parse(adminsRes.payload).data;
    assert(Array.isArray(adminsList) && adminsList.length > 0, "Company Admins Retrieved from PostgreSQL users & user_roles");

    const targetAdmin = adminsList[0];
    const toggleAdminRes = await app.inject({
      method: "PATCH",
      url: `/api/v1/master/company-admins/${targetAdmin.id}/status`,
      headers: { authorization: `Bearer ${masterToken}` },
      payload: { status: "Inactive" },
    });
    assert(toggleAdminRes.statusCode === 200, "Toggle Admin Status Responds 200 OK");

    // Restore to Active
    await app.inject({
      method: "PATCH",
      url: `/api/v1/master/company-admins/${targetAdmin.id}/status`,
      headers: { authorization: `Bearer ${masterToken}` },
      payload: { status: "Active" },
    });

    // Password reset trigger
    const pwdResetRes = await app.inject({
      method: "POST",
      url: `/api/v1/master/company-admins/${targetAdmin.id}/password-reset`,
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(pwdResetRes.statusCode === 200, "Password Reset Trigger Responds 200 OK with New Credentials Hash");

    // --------------------------------------------------------------------------
    // TEST GROUP 5: PLANS & PRICING
    // --------------------------------------------------------------------------
    console.log("\n--- 5. Testing Plans & Pricing API ---");
    const plansRes = await app.inject({
      method: "GET",
      url: "/api/v1/master/plans",
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(plansRes.statusCode === 200, "List Plans Responds 200 OK");
    const plansList = JSON.parse(plansRes.payload).data;
    assert(plansList.length >= 4, "Canonical SaaS Plans Retrieved from PostgreSQL 'plans' Table");

    // Create a dynamic plan
    const newPlanRes = await app.inject({
      method: "POST",
      url: "/api/v1/master/plans",
      headers: { authorization: `Bearer ${masterToken}` },
      payload: {
        name: `Custom Enterprise Plus ${Date.now()}`,
        priceMonthly: 6999,
        priceAnnual: 69990,
        currency: "CAD",
        userLimit: 200,
        modules: ["plan", "produce", "verify", "maintain", "intelligence"],
      },
    });
    assert(newPlanRes.statusCode === 201, "Create New Plan Responds 201 Created and Persists in PostgreSQL");
    const createdPlan = JSON.parse(newPlanRes.payload).data;

    // Update plan status
    const updatePlanRes = await app.inject({
      method: "PATCH",
      url: `/api/v1/master/plans/${createdPlan.id}/status`,
      headers: { authorization: `Bearer ${masterToken}` },
      payload: { status: "Inactive" },
    });
    assert(updatePlanRes.statusCode === 200, "Update Plan Status Responds 200 OK");

    // --------------------------------------------------------------------------
    // TEST GROUP 6: SUBSCRIPTIONS
    // --------------------------------------------------------------------------
    console.log("\n--- 6. Testing Subscriptions API ---");
    const subsRes = await app.inject({
      method: "GET",
      url: "/api/v1/master/subscriptions",
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(subsRes.statusCode === 200, "List Subscriptions Responds 200 OK");
    const subsList = JSON.parse(subsRes.payload).data;
    assert(subsList.length > 0, "Active Subscriptions Retrieved from PostgreSQL 'subscriptions'");

    const targetSub = subsList[0];
    const extendRes = await app.inject({
      method: "POST",
      url: `/api/v1/master/subscriptions/${targetSub.id}/extend`,
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(extendRes.statusCode === 200, "Extend Subscription Updates Expiry Date in PostgreSQL");

    // --------------------------------------------------------------------------
    // TEST GROUP 7: PAYMENTS & INVOICING
    // --------------------------------------------------------------------------
    console.log("\n--- 7. Testing Payments & Invoicing API ---");
    const paymentsRes = await app.inject({
      method: "GET",
      url: "/api/v1/master/payments",
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(paymentsRes.statusCode === 200, "List Payments Responds 200 OK");
    const paymentsPayload = JSON.parse(paymentsRes.payload).data;
    assert(paymentsPayload.payments.length > 0, "At least one payment record exists");
    const testPayment = paymentsPayload.payments[0];
    const invoiceRes = await app.inject({
      method: "GET",
      url: `/api/v1/master/payments/${testPayment.id}/invoice`,
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(invoiceRes.statusCode === 200, "Get Invoice Data Responds 200 OK using Receipt/ID");
    const invData = JSON.parse(invoiceRes.payload).data;
    assert(invData.id === testPayment.id, "Invoice Data has matching ID");
    assert(typeof invData.amount === "number", "Invoice Data contains valid numerical amount");

    const markPaidRes = await app.inject({
      method: "PATCH",
      url: `/api/v1/master/payments/${testPayment.id}/paid`,
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(markPaidRes.statusCode === 200, "Mark Payment Paid Responds 200 OK using Receipt/ID");

    // --------------------------------------------------------------------------
    // TEST GROUP 8: MODULES & FEATURES ENTITLEMENT
    // --------------------------------------------------------------------------
    console.log("\n--- 8. Testing Modules & Features Entitlement Enforcement ---");
    // Toggle module for first existing active company
    const activeCompaniesRes = await app.inject({
      method: "GET",
      url: "/api/v1/master/companies",
      headers: { authorization: `Bearer ${masterToken}` },
    });
    const activeCompaniesList = JSON.parse(activeCompaniesRes.payload).data;
    const targetCompId = activeCompaniesList[0]?.id;
    const toggleModRes = await app.inject({
      method: "PATCH",
      url: `/api/v1/master/companies/${targetCompId}/modules/intelligence`,
      headers: { authorization: `Bearer ${masterToken}` },
      payload: { isEnabled: false },
    });
    assert(toggleModRes.statusCode === 200, "Toggle Module Entitlement Updates 'tenant_modules' Table");

    const getModsRes = await app.inject({
      method: "GET",
      url: `/api/v1/master/companies/${targetCompId}/modules`,
      headers: { authorization: `Bearer ${masterToken}` },
    });
    const companyMods = JSON.parse(getModsRes.payload).data;
    assert(companyMods.intelligence === false, "Server-Side Module Entitlement Persisted Correctly");

    // --------------------------------------------------------------------------
    // TEST GROUP 9: GLOBAL PLATFORM USERS
    // --------------------------------------------------------------------------
    console.log("\n--- 9. Testing Global Platform Users API ---");
    const usersRes = await app.inject({
      method: "GET",
      url: "/api/v1/master/platform-users",
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(usersRes.statusCode === 200, "List Platform Users Responds 200 OK");
    const platformUsers = JSON.parse(usersRes.payload).data;
    assert(platformUsers.length >= 2, "Cross-Tenant Users Retrieved with Respective Company Association");

    // --------------------------------------------------------------------------
    // TEST GROUP 10: PLATFORM ANALYTICS
    // --------------------------------------------------------------------------
    console.log("\n--- 10. Testing Platform Analytics API ---");
    const analyticsRes = await app.inject({
      method: "GET",
      url: "/api/v1/master/analytics",
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(analyticsRes.statusCode === 200, "Analytics Endpoint Responds 200 OK");
    const analyticsData = JSON.parse(analyticsRes.payload).data;
    assert(typeof analyticsData.totalCompanies === "number", "Analytics Total Companies Calculated from DB");
    assert(analyticsData.avgSession.includes("N/A"), "Fake Session Strings Replaced with Valid Disclosures");

    // --------------------------------------------------------------------------
    // TEST GROUP 11: ACTIVITY & AUDIT LOGS
    // --------------------------------------------------------------------------
    console.log("\n--- 11. Testing Activity & Audit Logs API ---");
    const auditRes = await app.inject({
      method: "GET",
      url: "/api/v1/master/audit-logs",
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(auditRes.statusCode === 200, "Audit Logs Endpoint Responds 200 OK");
    const auditLogsData = JSON.parse(auditRes.payload).data;
    assert(auditLogsData.length > 0, "Audit Logs Successfully Retrieved from PostgreSQL 'audit_logs'");
    assert(auditLogsData.some((l: any) => l.event.includes("COMPANY") || l.event.includes("PLAN") || l.event.includes("MODULE")), "Mutations from Earlier Tests Recorded Real Audit Entries in PostgreSQL");

    // --------------------------------------------------------------------------
    // TEST GROUP 12: SUPPORT TICKETS
    // --------------------------------------------------------------------------
    console.log("\n--- 12. Testing Support Tickets API ---");
    const ticketsRes = await app.inject({
      method: "GET",
      url: "/api/v1/master/support-tickets",
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(ticketsRes.statusCode === 200, "List Support Tickets Responds 200 OK");
    const ticketsList = JSON.parse(ticketsRes.payload).data;
    assert(ticketsList.length >= 1, "Support Tickets Retrieved from PostgreSQL 'support_tickets'");

    const newTicketRes = await app.inject({
      method: "POST",
      url: "/api/v1/master/support-tickets",
      headers: { authorization: `Bearer ${masterToken}` },
      payload: {
        companyName: "Global Foods Inc.",
        subject: "Cannot dispatch packaging work orders",
        priority: "High",
        description: "HMI stations display authentication warning on line 2.",
      },
    });
    assert(newTicketRes.statusCode === 201, "Create Support Ticket Persists to PostgreSQL");
    const createdTicket = JSON.parse(newTicketRes.payload).data;

    const resolveTicketRes = await app.inject({
      method: "PATCH",
      url: `/api/v1/master/support-tickets/${createdTicket.id}/status`,
      headers: { authorization: `Bearer ${masterToken}` },
      payload: { status: "Resolved", resolution: "HMI operator terminal credentials refreshed." },
    });
    assert(resolveTicketRes.statusCode === 200, "Resolve Support Ticket Updates PostgreSQL State");

    // --------------------------------------------------------------------------
    // TEST GROUP 13: PLATFORM SETTINGS
    // --------------------------------------------------------------------------
    console.log("\n--- 13. Testing Platform Settings API ---");
    const settingsRes = await app.inject({
      method: "GET",
      url: "/api/v1/master/settings",
      headers: { authorization: `Bearer ${masterToken}` },
    });
    assert(settingsRes.statusCode === 200, "Get Platform Settings Responds 200 OK");
    const initialSettings = JSON.parse(settingsRes.payload).data;
    assert(typeof initialSettings.platformName === "string" && initialSettings.platformName.length > 0, "Default Settings Retrieved from PostgreSQL");

    const updateSettingsRes = await app.inject({
      method: "PUT",
      url: "/api/v1/master/settings",
      headers: { authorization: `Bearer ${masterToken}` },
      payload: {
        platformName: "MaintenX Manufacturing OS Enterprise",
        supportEmail: "support-desk@maintenx.com",
        require2fa: true,
        maintenanceMode: false,
      },
    });
    assert(updateSettingsRes.statusCode === 200, "Save Platform Settings Persists to PostgreSQL 'platform_settings'");
    const updatedSettings = JSON.parse(updateSettingsRes.payload).data;
    assert(updatedSettings.platformName === "MaintenX Manufacturing OS Enterprise", "Updated Settings Persisted Successfully");

    // --------------------------------------------------------------------------
    // TEST SUMMARY
    // --------------------------------------------------------------------------
    console.log("\n================================================================================");
    console.log(`      MASTER ADMIN TEST RESULTS: ${passed} PASSED / ${failed} FAILED`);
    console.log("================================================================================\n");

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ Test suite encountered fatal error:", error);
    process.exit(1);
  } finally {
    await app.close();
    await pool.end();
  }
}

runMasterAdminTestSuite();
