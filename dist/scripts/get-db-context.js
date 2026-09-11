"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
const tenants_js_1 = require("../db/schema/tenants.js");
const tenants_js_2 = require("../db/schema/tenants.js");
const users_js_1 = require("../db/schema/users.js");
async function main() {
    const [t] = await database_js_1.db.select().from(tenants_js_1.tenants).limit(1);
    const p = await database_js_1.db.select().from(tenants_js_2.plants);
    const u = await database_js_1.db.select().from(users_js_1.users);
    console.log("DEFAULT TENANT:", t);
    console.log("PLANTS:", p.map(x => ({ id: x.id, code: x.code, name: x.name })));
    console.log("USERS COUNT:", u.length);
    console.log("FIRST 3 USERS:", u.slice(0, 3).map(x => ({ id: x.id, email: x.email, firstName: x.firstName })));
    process.exit(0);
}
main().catch(console.error);
//# sourceMappingURL=get-db-context.js.map