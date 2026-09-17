import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:hitesha2004@localhost:5432/maintenx-os"
});

async function run() {
  try {
    const tRes = await pool.query(`SELECT id FROM public.tenants LIMIT 1`);
    const validTenant = tRes.rows[0]?.id;
    const pRes = await pool.query(`SELECT id FROM public.plants LIMIT 1`);
    const validPlant = pRes.rows[0]?.id;
    const uRes = await pool.query(`SELECT id FROM public.users LIMIT 1`);
    const validUser = uRes.rows[0]?.id;

    console.log("Tenant:", validTenant, "Plant:", validPlant, "User:", validUser);

    const ticketId = `EXC-EMG-${Math.floor(100 + Math.random() * 900)}`;

    console.log("Testing Step 1: INSERT INTO public.exceptions...");
    try {
      await pool.query(`
        INSERT INTO public.exceptions (tenant_id, plant_id, exception_code, severity, module, title, description, status, reported_at)
        VALUES ($1, $2, $3, 'P1', 'SAFETY', 'EMERGENCY: Test', 'Priority P1 Emergency Maintenance Broadcast Dispatched', 'ACTIVE', NOW())
      `, [validTenant, validPlant, ticketId]);
      console.log("Step 1 PASSED!");
    } catch(e) {
      console.error("Step 1 FAILED:", e);
    }

    console.log("Testing Step 2: INSERT INTO public.pm_exceptions...");
    try {
      await pool.query(`
        INSERT INTO public.pm_exceptions (id, tenant_id, plant_id, title, severity, category, asset_or_order, impact_description, owner, escalation_level, status, stage, created_at, updated_at)
        VALUES ($1, $2, $3, 'EMERGENCY: Test', 'P1', 'Safety Hazard', 'PLANT-WIDE', 'Priority P1 Emergency Maintenance Broadcast Dispatched', 'On-Call Maintenance Tech', 'L1 - Immediate Dispatch', 'Active', 'SAFETY', NOW(), NOW())
      `, [`EX-EMG-${Math.floor(200 + Math.random() * 800)}`, validTenant, validPlant]);
      console.log("Step 2 PASSED!");
    } catch(e) {
      console.error("Step 2 FAILED:", e);
    }

    console.log("Testing Step 3: INSERT INTO public.digital_signatures...");
    try {
      await pool.query(`
        INSERT INTO public.digital_signatures (tenant_id, plant_id, user_id, entity_type, entity_id, meaning, comments, signed_at)
        VALUES ($1, $2, $3, 'EMERGENCY_MAINTENANCE_CALL', $4, 'EMERGENCY_PAGER_BROADCAST', 'Test', NOW())
      `, [validTenant, validPlant, validUser, ticketId]);
      console.log("Step 3 PASSED!");
    } catch(e) {
      console.error("Step 3 FAILED:", e);
    }

    console.log("Testing Step 4: INSERT INTO public.notifications...");
    try {
      await pool.query(`
        INSERT INTO public.notifications (tenant_id, plant_id, title, message, category, severity, is_read, link_url, created_at)
        VALUES ($1, $2, 'EMERGENCY: Test', 'Priority P1 Emergency Maintenance Broadcast Dispatched', 'system', 'CRITICAL', false, '/operator/report-issue', NOW())
      `, [validTenant, validPlant]);
      console.log("Step 4 PASSED!");
    } catch(e) {
      console.error("Step 4 FAILED:", e);
    }

    await pool.end();
  } catch (err) {
    console.error("Test Error:", err);
  }
}

run();
