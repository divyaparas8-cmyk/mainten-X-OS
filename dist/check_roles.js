"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("./config/database.js");
const index_js_1 = require("./db/schema/index.js");
async function main() {
    const allTenants = await database_js_1.db.select().from(index_js_1.tenants);
    console.log("TENANTS:", allTenants.map(t => ({ id: t.id, name: t.name, slug: t.slug })));
    const allPlants = await database_js_1.db.select().from(index_js_1.plants);
    console.log("PLANTS:", allPlants.map(p => ({ id: p.id, name: p.name, code: p.code })));
    const allRoles = await database_js_1.db.select().from(index_js_1.roles);
    console.log("ROLES:", allRoles.map(r => ({ id: r.id, code: r.code, name: r.name })));
    process.exit(0);
}
main().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
});
//# sourceMappingURL=check_roles.js.map