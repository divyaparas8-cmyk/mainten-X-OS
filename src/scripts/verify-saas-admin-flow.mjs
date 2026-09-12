async function testSaaSFlow() {
  const ts = Date.now().toString(36);

  console.log("=== 1. Login as Master Admin ===");
  const masterRes = await fetch("http://localhost:4000/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "master@maintenx.com", password: "Password@123" }),
  });
  const masterData = await masterRes.json();
  const masterToken = masterData?.data?.token;
  console.log("Master login token present:", Boolean(masterToken));

  console.log("\n=== 2. Create Company ===");
  const companyPayload = {
    name: `Apex Industry ${ts}`,
    admin: "Suresh Raina",
    adminEmail: `suresh.${ts}@apex.com`,
    adminPhone: "+91 98765 00000",
    subscription: "Plant Pilot",
  };
  const compRes = await fetch("http://localhost:4000/api/v1/master/companies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${masterToken}`,
    },
    body: JSON.stringify(companyPayload),
  });
  const compData = await compRes.json();
  console.log("Company creation status:", compRes.status);
  console.log("Company created:", compData?.data?.name);

  console.log("\n=== 3. Create Company Administrator with Password ===");
  const adminPayload = {
    name: "Vikram Admin",
    email: `vikram.${ts}@apex.com`,
    password: "AdminPassword@123",
    company: compData?.data?.name,
    companyId: compData?.data?.id,
  };
  const adminRes = await fetch("http://localhost:4000/api/v1/master/company-admins", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${masterToken}`,
    },
    body: JSON.stringify(adminPayload),
  });
  const adminData = await adminRes.json();
  console.log("Admin creation status:", adminRes.status);
  console.log("Admin created:", adminData?.data?.email);

  console.log("\n=== 4. Login as Newly Created Company Administrator ===");
  const loginRes = await fetch("http://localhost:4000/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: adminPayload.email,
      password: adminPayload.password,
    }),
  });
  const loginData = await loginRes.json();
  console.log("Login status:", loginRes.status);
  console.log("User Email:", loginData?.data?.user?.email);
  console.log("User Role:", loginData?.data?.user?.role);
  console.log("Tenant Name:", loginData?.data?.tenant?.name);

  if (loginData?.data?.user?.role === "admin" && loginData?.data?.tenant?.name === companyPayload.name) {
    console.log("\n🎉 SUCCESS: SaaS flow verified! User logged in as 'admin' and gets their own company name!");
  } else {
    console.error("\n❌ FAILED: Unexpected role or tenant", loginData);
    process.exit(1);
  }
}

testSaaSFlow().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
