"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const raw = fs_1.default.readFileSync("src/scripts/audit-output.json", "utf8").replace(/^\uFEFF/, "");
const data = JSON.parse(raw);
console.log(`Total Tables Audited: ${data.totalTables}`);
// Tables missing PK
const missingPK = data.tables.filter(t => t.primaryKey.length === 0);
console.log(`Tables with NO Primary Key: ${missingPK.length}`, missingPK.map(t => t.tableName));
// Tables missing tenant_id
const missingTenant = data.tables.filter(t => !t.hasTenantId);
console.log(`Tables without tenant_id: ${missingTenant.length}`, missingTenant.map(t => t.tableName));
// Tables with plant_id
const withPlant = data.tables.filter(t => t.hasPlantId);
console.log(`Tables with plant_id: ${withPlant.length}`, withPlant.map(t => t.tableName));
// Tables with 0 FKs
const noFK = data.tables.filter(t => t.foreignKeys.length === 0);
console.log(`Tables with NO Foreign Keys: ${noFK.length}`, noFK.map(t => t.tableName));
// Check overlap tables columns
const overlapTables = [
    "aps_schedules", "pm_production_schedules", "pm_schedules", "production_orders",
    "downtime_logs", "ci_losses",
    "capa_records", "ci_capa_actions",
    "documents", "ci_standards",
    "assets", "pm_machine_telemetry",
    "inventory_lots", "spare_parts",
    "customer_orders", "shipment_orders"
];
console.log("\n=== OVERLAP TABLE COLUMNS & FKS ===");
for (const name of overlapTables) {
    const t = data.tables.find(x => x.tableName === name);
    if (t) {
        console.log(`\nTable: ${t.tableName} (Rows: ${t.rowCount}, PK: ${t.primaryKey.join(", ")})`);
        console.log(`  Columns: ${t.columns.join(", ")}`);
        console.log(`  FKs: ${t.foreignKeys.join("; ") || "None"}`);
    }
    else {
        console.log(`\nTable: ${name} NOT FOUND!`);
    }
}
//# sourceMappingURL=analyze-audit.js.map