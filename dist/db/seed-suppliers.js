"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
async function seedSuppliers() {
    try {
        const t = await database_js_1.pool.query("SELECT id FROM tenants LIMIT 1");
        const tenantId = t.rows[0]?.id || null;
        await database_js_1.pool.query(`INSERT INTO suppliers (
        id, tenant_id, supplier_code, name, category, materials_supplied, status,
        otif_score, quality_acceptance_rate, avg_lead_time_days, risk_rating,
        contact_email, contact_phone, last_order, open_orders_count, active_contracts_count
      ) VALUES (
        'SUP-KIAAN-01', $1, 'VND-KIA-01', 'Kiaan', 'Specialty Flavors & Extracts',
        'Specialty Flavors, Extracts & Concentrates', 'Active',
        98.0, 99.4, 3.0, 'Medium Risk',
        'contact@kiaan.com', '+91 98765 43210', '2026-09-10 (PO-445)', 0, 1
      ) ON CONFLICT (id) DO NOTHING`, [tenantId]);
        const res = await database_js_1.pool.query("SELECT id, name, category, status FROM suppliers;");
        console.log("✅ Suppliers in DB:", res.rows);
    }
    catch (err) {
        console.error("Error seeding supplier:", err);
    }
    finally {
        await database_js_1.pool.end();
    }
}
seedSuppliers();
//# sourceMappingURL=seed-suppliers.js.map