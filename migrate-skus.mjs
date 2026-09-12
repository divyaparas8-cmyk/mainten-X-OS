import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is missing in .env');
  }

  const client = new Client({ connectionString });
  await client.connect();
  const db = drizzle(client);

  try {
    console.log('Adding plant_id to skus table...');
    await db.execute(sql`ALTER TABLE skus ADD COLUMN plant_id UUID REFERENCES plants(id) ON DELETE CASCADE;`);
    console.log('Column plant_id added successfully.');
  } catch (error) {
    console.error('Error modifying table:', error);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
