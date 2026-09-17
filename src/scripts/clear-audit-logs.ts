import { db } from "../config/database.js";
import { auditLogs } from "../db/schema/audit.js";

async function main() {
  console.log("Clearing dummy audit logs from PostgreSQL...");
  const result = await db.delete(auditLogs);
  console.log("Successfully deleted all dummy audit logs from audit_logs table.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error deleting audit logs:", err);
  process.exit(1);
});
