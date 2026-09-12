import { db } from "../../src/config/database.js";
import { supportTickets } from "../../src/db/schema/index.js";
import { eq } from "drizzle-orm";

async function main() {
  const tickets = await db.select().from(supportTickets);
  console.log("Total tickets before cleanup:", tickets.length);

  const dummyTickets = tickets.filter((t) => t.companyName === "Global Foods Inc.");
  console.log("Global Foods dummy tickets to delete:", dummyTickets.length);

  for (const t of dummyTickets) {
    await db.delete(supportTickets).where(eq(supportTickets.id, t.id));
    console.log("Deleted ticket:", t.id, "-", t.subject);
  }

  const remaining = await db.select().from(supportTickets);
  console.log("\nRemaining tickets:", remaining.length);
  remaining.forEach((t) => console.log(" -", t.id, "|", t.companyName, "|", t.status));

  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
