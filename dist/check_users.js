"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("./config/database.js");
const index_js_1 = require("./db/schema/index.js");
async function main() {
    const rows = await database_js_1.db.select().from(index_js_1.users);
    console.log("USERS COUNT:", rows.length);
    for (const r of rows) {
        console.log(`- email: ${r.email}, name: ${r.firstName} ${r.lastName}, status: ${r.status}, isMaster: ${r.isMasterAdmin}`);
    }
    process.exit(0);
}
main().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
});
//# sourceMappingURL=check_users.js.map