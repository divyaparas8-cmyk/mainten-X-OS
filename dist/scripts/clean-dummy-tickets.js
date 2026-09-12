"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../../src/config/database.js");
const index_js_1 = require("../../src/db/schema/index.js");
const drizzle_orm_1 = require("drizzle-orm");
async function main() {
    const tickets = await database_js_1.db.select().from(index_js_1.supportTickets);
    console.log("Total tickets before cleanup:", tickets.length);
    const dummyTickets = tickets.filter((t) => t.companyName === "Global Foods Inc.");
    console.log("Global Foods dummy tickets to delete:", dummyTickets.length);
    for (const t of dummyTickets) {
        await database_js_1.db.delete(index_js_1.supportTickets).where((0, drizzle_orm_1.eq)(index_js_1.supportTickets.id, t.id));
        console.log("Deleted ticket:", t.id, "-", t.subject);
    }
    const remaining = await database_js_1.db.select().from(index_js_1.supportTickets);
    console.log("\nRemaining tickets:", remaining.length);
    remaining.forEach((t) => console.log(" -", t.id, "|", t.companyName, "|", t.status));
    process.exit(0);
}
main().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
});
//# sourceMappingURL=clean-dummy-tickets.js.map