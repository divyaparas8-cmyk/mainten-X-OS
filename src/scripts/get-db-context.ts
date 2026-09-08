import { db } from "../config/database.js";
import { tenants } from "../db/schema/tenants.js";
import { plants } from "../db/schema/tenants.js";
import { users } from "../db/schema/users.js";

async function main() {
  const [t] = await db.select().from(tenants).limit(1);
  const p = await db.select().from(plants);
  const u = await db.select().from(users);

  console.log("DEFAULT TENANT:", t);
  console.log("PLANTS:", p.map(x => ({ id: x.id, code: x.code, name: x.name })));
  console.log("USERS COUNT:", u.length);
  console.log("FIRST 3 USERS:", u.slice(0, 3).map(x => ({ id: x.id, email: x.email, firstName: x.firstName })));
  process.exit(0);
}

main().catch(console.error);
