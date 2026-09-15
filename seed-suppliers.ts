import { pool } from "./src/config/database";

const DEFAULT_TENANT_ID = null;

const SUPPLIERS_DATA = [
  {
    id: "SUP-001",
    tenant_id: DEFAULT_TENANT_ID,
    supplier_code: "VND-CVF-01",
    name: "Citrus Valley Farms Co.",
    category: "Raw Material Concentrate",
    materials_supplied: "Valencia Orange Concentrate 65° Brix, Lime Puree, Essential Citrus Oils",
    status: "Active",
    otif_score: "98.20",
    quality_acceptance_rate: "99.60",
    avg_lead_time_days: "4.50",
    risk_rating: "Low Risk",
    contact_email: "orders@citrusvalleyfarms.com",
    contact_phone: "+1 (555) 349-8821",
    last_order: "2026-08-28 (PO-441)",
    open_orders_count: 2,
    active_contracts_count: 3
  },
  {
    id: "SUP-002",
    tenant_id: DEFAULT_TENANT_ID,
    supplier_code: "VND-AMC-03",
    name: "Amcor Rigid Packaging",
    category: "Packaging Containers",
    materials_supplied: "500ml PET Bottles, 28mm Oxygen Barrier Caps, Shrink Bundling Films",
    status: "Active",
    otif_score: "96.50",
    quality_acceptance_rate: "99.10",
    avg_lead_time_days: "3.20",
    risk_rating: "Low Risk",
    contact_email: "orders@amcor.com",
    contact_phone: "+1 (555) 812-4409",
    last_order: "2026-08-22 (PO-429)",
    open_orders_count: 1,
    active_contracts_count: 2
  },
  {
    id: "SUP-003",
    tenant_id: DEFAULT_TENANT_ID,
    supplier_code: "VND-BEI-06",
    name: "Botanical Extracts International",
    category: "Specialty Flavors & Extracts",
    materials_supplied: "Organic Yuzu Terpenes, Blood Orange Distillate, Ginger Root Oleoresin",
    status: "Active",
    otif_score: "88.00",
    quality_acceptance_rate: "97.40",
    avg_lead_time_days: "8.00",
    risk_rating: "Medium Risk - Long Lead Time",
    contact_email: "supply@botanicalextracts.com",
    contact_phone: "+1 (555) 902-1144",
    last_order: "2026-08-10 (PO-398)",
    open_orders_count: 1,
    active_contracts_count: 1
  },
  {
    id: "SUP-004",
    tenant_id: DEFAULT_TENANT_ID,
    supplier_code: "VND-BLL-04",
    name: "Ball Metal Beverage Packaging",
    category: "Packaging Cans",
    materials_supplied: "330ml Sleek Cans (BPA-NI), 202 Dia CDL Can Ends w/ Gold Tab",
    status: "Active",
    otif_score: "99.10",
    quality_acceptance_rate: "99.80",
    avg_lead_time_days: "2.80",
    risk_rating: "Low Risk",
    contact_email: "orders@ballmetal.com",
    contact_phone: "+1 (555) 671-3302",
    last_order: "2026-08-18 (PO-422)",
    open_orders_count: 1,
    active_contracts_count: 4
  },
  {
    id: "SUP-005",
    tenant_id: DEFAULT_TENANT_ID,
    supplier_code: "VND-SVR-05",
    name: "Sugar Valley Refining Ltd.",
    category: "Sweeteners & Sugars",
    materials_supplied: "Non-GMO Liquid Cane Sugar 67.5° Brix, Granulated Sucrose Grade A",
    status: "Active",
    otif_score: "97.50",
    quality_acceptance_rate: "99.40",
    avg_lead_time_days: "3.50",
    risk_rating: "Low Risk",
    contact_email: "dispatch@sugarvalley.com",
    contact_phone: "+1 (555) 438-7719",
    last_order: "2026-08-15 (PO-415)",
    open_orders_count: 0,
    active_contracts_count: 2
  }
];

async function seedSuppliers() {
  console.log("Seeding suppliers into PostgreSQL database...");
  for (const s of SUPPLIERS_DATA) {
    await pool.query(
      `INSERT INTO suppliers (
        id, tenant_id, supplier_code, name, category, materials_supplied,
        status, otif_score, quality_acceptance_rate, avg_lead_time_days,
        risk_rating, contact_email, contact_phone, last_order,
        open_orders_count, active_contracts_count, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        supplier_code = EXCLUDED.supplier_code,
        category = EXCLUDED.category,
        materials_supplied = EXCLUDED.materials_supplied,
        status = EXCLUDED.status,
        otif_score = EXCLUDED.otif_score,
        quality_acceptance_rate = EXCLUDED.quality_acceptance_rate,
        avg_lead_time_days = EXCLUDED.avg_lead_time_days,
        risk_rating = EXCLUDED.risk_rating,
        contact_email = EXCLUDED.contact_email,
        contact_phone = EXCLUDED.contact_phone,
        last_order = EXCLUDED.last_order,
        open_orders_count = EXCLUDED.open_orders_count,
        active_contracts_count = EXCLUDED.active_contracts_count,
        updated_at = NOW();`,
      [
        s.id,
        s.tenant_id,
        s.supplier_code,
        s.name,
        s.category,
        s.materials_supplied,
        s.status,
        s.otif_score,
        s.quality_acceptance_rate,
        s.avg_lead_time_days,
        s.risk_rating,
        s.contact_email,
        s.contact_phone,
        s.last_order,
        s.open_orders_count,
        s.active_contracts_count
      ]
    );
  }

  const res = await pool.query("SELECT id, name, supplier_code, status, tenant_id FROM suppliers");
  console.log(`Successfully seeded! Total suppliers in DB: ${res.rows.length}`);
  console.table(res.rows);
  await pool.end();
}

seedSuppliers().catch(e => {
  console.error("Failed to seed suppliers:", e);
  process.exit(1);
});
