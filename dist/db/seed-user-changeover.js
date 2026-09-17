"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
async function main() {
    try {
        await database_js_1.pool.query(`
      INSERT INTO public.changeover_rules (
        id, matrix_id, from_sku_id, from_sku_code, from_family,
        to_sku_id, to_sku_code, to_family, changeover_duration_min,
        sanitation_class, allergen_cleaning_required, notes, status
      ) VALUES (
        'CO-VAL-01', 'CO-VAL-01', 'SKU-VAL-8106', 'SKU-VAL-8106', 'FINISHED_GOODS',
        'SKU-VAL-8106', 'SKU-VAL-8106', 'FINISHED_GOODS', 35,
        'Class B - Warm Water Flush & Sanitizer Rinse', false,
        'Validation batch transition with automated warm water CIP wash', 'Active'
      ) ON CONFLICT (id) DO UPDATE SET
        matrix_id = EXCLUDED.matrix_id,
        from_sku_id = EXCLUDED.from_sku_id,
        from_sku_code = EXCLUDED.from_sku_code,
        from_family = EXCLUDED.from_family,
        to_sku_id = EXCLUDED.to_sku_id,
        to_sku_code = EXCLUDED.to_sku_code,
        to_family = EXCLUDED.to_family,
        changeover_duration_min = EXCLUDED.changeover_duration_min,
        sanitation_class = EXCLUDED.sanitation_class,
        allergen_cleaning_required = EXCLUDED.allergen_cleaning_required,
        notes = EXCLUDED.notes,
        status = EXCLUDED.status,
        updated_at = NOW();
    `);
        console.log("✅ Successfully seeded SKU-VAL-8106 into public.changeover_rules!");
    }
    catch (err) {
        console.error("❌ Error:", err);
    }
    finally {
        await database_js_1.pool.end();
    }
}
main();
//# sourceMappingURL=seed-user-changeover.js.map