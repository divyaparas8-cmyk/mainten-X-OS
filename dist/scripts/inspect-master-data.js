"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
const index_js_1 = require("../db/schema/index.js");
async function main() {
    const allTenants = await database_js_1.db.select().from(index_js_1.tenants);
    console.log("=== TENANTS ===", allTenants.map(t => ({ id: t.id, name: t.name, status: t.status, plan: t.plan })));
    const allTickets = await database_js_1.db.select().from(index_js_1.supportTickets);
    console.log("=== SUPPORT TICKETS ===", allTickets.map(tk => ({ id: tk.id, subject: tk.subject, companyName: tk.companyName, status: tk.status })));
    const allPayments = await database_js_1.db.select().from(index_js_1.payments);
    console.log("=== PAYMENTS ===", allPayments.map(p => ({ id: p.id, receiptNumber: p.receiptNumber, amount: p.amount, status: p.status, tenantId: p.tenantId })));
    const allUsers = await database_js_1.db.select().from(index_js_1.users);
    console.log("=== USERS COUNT ===", allUsers.length);
    console.log("=== USERS SAMPLE ===", allUsers.slice(0, 10).map(u => ({ id: u.id, email: u.email, status: u.status, tenantId: u.tenantId })));
    process.exit(0);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
