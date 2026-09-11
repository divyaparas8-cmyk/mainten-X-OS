import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "./env.js";
import * as schema from "../db/schema/index.js";
import * as relations from "../db/relations.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool, { schema: { ...schema, ...relations } });

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (error) {
    console.warn("⚠️ Database connection check failed (PostgreSQL might be offline or initializing):", (error as Error).message);
    return false;
  }
}
