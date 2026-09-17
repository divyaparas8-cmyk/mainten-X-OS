import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:hitesha2004@localhost:5432/maintenx-os"
});

async function run() {
  try {
    console.log("Checking DB notifications table...");
    const beforeNotifs = await pool.query(`SELECT id, title, message, created_at FROM public.notifications ORDER BY created_at DESC LIMIT 5;`);
    console.log("Notifications before API call:", beforeNotifs.rows);

    console.log("Testing POST to backend /api/v1/dashboards/operator/report-issue/emergency-call...");
    const res = await fetch("http://localhost:4000/api/v1/dashboards/operator/report-issue/emergency-call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hazardType: "Chemical Spill / Ammonia Leak"
      })
    });

    const data = await res.json();
    console.log("API Response:", data);

    const afterNotifs = await pool.query(`SELECT id, title, message, created_at FROM public.notifications ORDER BY created_at DESC LIMIT 5;`);
    console.log("Notifications AFTER API call:", afterNotifs.rows);

    await pool.end();
  } catch (err) {
    console.error("Test Error:", err);
  }
}

run();
