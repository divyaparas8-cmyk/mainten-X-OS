import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:hitesha2004@localhost:5432/maintenx-os"
});

async function run() {
  try {
    const certs = ["OSHA 30-Hour Safety", "Aseptic Bottling Line Specialist", "SCADA Level 1"];
    console.log("Updating public.staff certifications as JSON...");
    await pool.query(`
      UPDATE public.staff 
      SET certifications = $1::json
      WHERE tenant_id = '5bce8458-909a-4dd2-b221-614c32ac7c89';
    `, [JSON.stringify(certs)]);

    console.log("Reading public.staff AFTER update...");
    const res = await pool.query(`SELECT certifications FROM public.staff WHERE tenant_id = '5bce8458-909a-4dd2-b221-614c32ac7c89';`);
    console.log("Updated Certifications in DB:", res.rows[0].certifications);

    await pool.end();
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
