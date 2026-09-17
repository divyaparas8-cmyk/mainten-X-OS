import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:hitesha2004@localhost:5432/maintenx-os"
});

async function run() {
  try {
    const tRes = await pool.query(`SELECT id FROM public.tenants LIMIT 1`);
    const validTenant = tRes.rows[0]?.id || '5bce8458-909a-4dd2-b221-614c32ac7c89';
    const pRes = await pool.query(`SELECT id FROM public.plants LIMIT 1`);
    const validPlant = pRes.rows[0]?.id || '83c90534-4761-495c-b2bf-6a61de2260c4';

    console.log("1. Inserting 3 fresh notifications for testing...");
    await pool.query(`
      INSERT INTO public.notifications (tenant_id, plant_id, title, message, category, severity, is_read, link_url, created_at)
      VALUES 
      ($1, $2, 'CRUD Test 1: High Pressure Alert', 'Pressure exceeded 45 PSI', 'system', 'HIGH', false, '/operator/dashboard', NOW()),
      ($1, $2, 'CRUD Test 2: SOP Clearance Needed', 'Sign off on new procedure', 'sop', 'INFO', false, '/operator/work-instructions', NOW()),
      ($1, $2, 'CRUD Test 3: Raw Material Low', 'Brix syrup stock low', 'pm', 'WARNING', false, '/operator/material-request', NOW());
    `, [validTenant, validPlant]);

    const res1 = await pool.query(`SELECT id, title, is_read FROM public.notifications ORDER BY created_at DESC LIMIT 3;`);
    console.log("Current DB Notifications:", res1.rows);

    const testId1 = res1.rows[2].id; // First inserted item
    const testId2 = res1.rows[1].id; // Second item

    // Test 1: Mark single notification as read
    console.log(`\n--- Test A: Mark Single Notification (${testId1}) As Read ---`);
    const readRes = await fetch(`http://localhost:4000/api/v1/dashboards/operator/notifications/${testId1}/read`, {
      method: "POST"
    });
    console.log("Read API Response:", await readRes.json());
    const dbCheckRead = await pool.query(`SELECT id, title, is_read FROM public.notifications WHERE id::text = $1;`, [testId1]);
    console.log("DB Record after Mark as Read (is_read should be true):", dbCheckRead.rows[0]);

    // Test 2: Mark All as Read
    console.log(`\n--- Test B: Mark All Notifications As Read ---`);
    const readAllRes = await fetch(`http://localhost:4000/api/v1/dashboards/operator/notifications/read-all`, {
      method: "POST"
    });
    console.log("Read All API Response:", await readAllRes.json());
    const dbCheckReadAll = await pool.query(`SELECT id, title, is_read FROM public.notifications;`);
    console.log("DB Records after Mark All as Read:", dbCheckReadAll.rows);

    // Test 3: Single Delete
    console.log(`\n--- Test C: Delete Single Notification (${testId2}) ---`);
    const delRes = await fetch(`http://localhost:4000/api/v1/dashboards/operator/notifications/${testId2}`, {
      method: "DELETE"
    });
    console.log("Delete API Response:", await delRes.json());
    const dbCheckDel = await pool.query(`SELECT id FROM public.notifications WHERE id::text = $1;`, [testId2]);
    console.log("DB Rows matching deleted ID (should be empty):", dbCheckDel.rows);

    // Test 4: Clear All
    console.log(`\n--- Test D: Clear All Notifications ---`);
    const clearAllRes = await fetch(`http://localhost:4000/api/v1/dashboards/operator/notifications/clear-all`, {
      method: "DELETE"
    });
    console.log("Clear All API Response:", await clearAllRes.json());
    const dbCheckClearAll = await pool.query(`SELECT COUNT(*) FROM public.notifications;`);
    console.log("Total DB Notification count after Clear All (should be 0):", dbCheckClearAll.rows[0].count);

    await pool.end();
  } catch (err) {
    console.error("CRUD Test Error:", err);
  }
}

run();
