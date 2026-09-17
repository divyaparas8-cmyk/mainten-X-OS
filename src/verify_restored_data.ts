import pg from 'pg';
const { Pool } = pg;

async function checkSampleData() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
  });

  try {
    const usersCount = await pool.query('SELECT count(*) FROM public.users');
    const exceptionsCount = await pool.query('SELECT count(*) FROM public.exceptions');
    const assetsCount = await pool.query('SELECT count(*) FROM public.assets');
    const ordersCount = await pool.query('SELECT count(*) FROM public.production_orders');

    console.log('✅ Users Count:', usersCount.rows[0].count);
    console.log('✅ Exceptions Count:', exceptionsCount.rows[0].count);
    console.log('✅ Assets Count:', assetsCount.rows[0].count);
    console.log('✅ Production Orders Count:', ordersCount.rows[0].count);
  } catch (err: any) {
    console.error('Error querying database:', err.message);
  }

  await pool.end();
}

checkSampleData();
