import { db } from "../config/database.js";
import { tenants, users, payments, subscriptions, supportTickets, tenantModules } from "../db/schema/index.js";

async function main() {
  const allTenants = await db.select().from(tenants);
  console.log("=== TENANTS ===", allTenants.map(t => ({ id: t.id, name: t.name, status: t.status, plan: t.plan })));

  const allTickets = await db.select().from(supportTickets);
  console.log("=== SUPPORT TICKETS ===", allTickets.map(tk => ({ id: tk.id, subject: tk.subject, companyName: tk.companyName, status: tk.status })));

  const allPayments = await db.select().from(payments);
  console.log("=== PAYMENTS ===", allPayments.map(p => ({ id: p.id, receiptNumber: p.receiptNumber, amount: p.amount, status: p.status, tenantId: p.tenantId })));

  const allUsers = await db.select().from(users);
  console.log("=== USERS COUNT ===", allUsers.length);
  console.log("=== USERS SAMPLE ===", allUsers.slice(0, 10).map(u => ({ id: u.id, email: u.email, status: u.status, tenantId: u.tenantId })));


  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
