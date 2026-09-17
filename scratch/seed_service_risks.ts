import 'dotenv/config';
import { db, pool } from '../src/config/database.js';
import { serviceRisks } from '../src/db/schema/planning.js';
import { tenants } from '../src/db/schema/tenants.js';

async function run() {
  try {
    const tenantRows = await db.select({ id: tenants.id }).from(tenants).limit(1);
    const tenantId = tenantRows[0]?.id || "11111111-1111-1111-1111-111111111111";

    const seeds = [
      {
        tenantId,
        riskCode: "RSK-01",
        customer: "Kroger Mid-Atlantic",
        orderRef: "PO-KR-99321",
        riskTitle: "28mm Tamper-Evident HDPE Cap Shortage Risk",
        potentialPenalty: "$14,500 (OTIF SLA Clause 4.2)",
        financialExposure: "14500.00",
        severity: "High Risk",
        impact: "Late Delivery on 24,000 Bottles Tonic Water",
        recommendation: "Authorize expedited air-freight shipment from secondary packaging vendor.",
        isMitigated: false
      },
      {
        tenantId,
        riskCode: "RSK-02",
        customer: "Whole Foods Market",
        orderRef: "PO-WF-88901",
        riskTitle: "Line 1 High-Capacity Scheduling Compression",
        potentialPenalty: "$8,200",
        financialExposure: "8200.00",
        severity: "Medium Risk",
        impact: "Potential 6-hour delay during Friday changeover window",
        recommendation: "Pre-stage sterile wash CIP fluids 2 hours before run completion.",
        isMitigated: false
      }
    ];

    await db.insert(serviceRisks).values(seeds);
    console.log("Successfully seeded service_risks table!");

    const rows = await db.select().from(serviceRisks);
    console.log("Total rows in service_risks table:", rows.length);
    console.log(rows);
  } catch (err: any) {
    console.error("Error seeding service_risks:", err.message);
  } finally {
    await pool.end();
  }
}

run();
