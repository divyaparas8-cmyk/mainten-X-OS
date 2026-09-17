import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:hitesha2004@localhost:5432/maintenx-os"
});

async function run() {
  try {
    console.log("Fetching top notification from DB...");
    const res = await pool.query(`SELECT id, title FROM public.notifications ORDER BY created_at DESC LIMIT 1;`);
    if (res.rows.length === 0) {
      console.log("No notifications found to delete!");
      await pool.end();
      return;
    }

    const targetId = res.rows[0].id;
    console.log("Target Notification ID to delete:", targetId, "Title:", res.rows[0].title);

    console.log(`Calling DELETE http://localhost:4000/api/v1/dashboards/operator/notifications/${targetId} ...`);
    const apiRes = await fetch(`http://localhost:4000/api/v1/dashboards/operator/notifications/${targetId}`, {
      method: "DELETE"
    });
    const data = await apiRes.json();
    console.log("DELETE API Response:", data);

    console.log("Checking DB after DELETE API call...");
    const checkRes = await pool.query(`SELECT id, title FROM public.notifications WHERE id::text = $1;`, [targetId]);
    console.log("Rows matching deleted ID in DB (should be empty):", checkRes.rows);

    await pool.end();
  } catch (err) {
    console.error("Test Error:", err);
  }
}

run();
