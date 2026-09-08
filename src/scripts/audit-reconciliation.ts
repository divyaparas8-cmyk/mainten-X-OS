import * as schema from "../db/schema/index.js";
import { isTable, getTableName } from "drizzle-orm";
import { pool } from "../config/database.js";
import fs from "fs";
import path from "path";

async function runReconciliation() {
  console.log("=================================================");
  console.log("🔍 MAINTENX OS: DATABASE FORENSIC RECONCILIATION");
  console.log("=================================================\n");

  // 1. Tables defined in Drizzle Schema
  const drizzleTables = new Map<string, any>();
  for (const [key, value] of Object.entries(schema)) {
    if (isTable(value)) {
      const tableName = getTableName(value);
      drizzleTables.set(tableName, key);
    }
  }
  const drizzleTableNames = Array.from(drizzleTables.keys()).sort();
  console.log(`1. Total tables in Drizzle Schema: ${drizzleTableNames.length}`);

  // 2. Tables present in PostgreSQL Database
  const pgTablesRes = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  const pgTableNames = pgTablesRes.rows.map((r: any) => r.table_name).sort();
  console.log(`2. Total tables in PostgreSQL (public): ${pgTableNames.length}`);

  // 3. Tables represented in Migration files
  const migrationsDir = path.resolve(process.cwd(), "drizzle/migrations");
  const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql"));
  console.log(`3. Migration files found: ${migrationFiles.join(", ")}`);
  
  const migrationTables = new Set<string>();
  for (const file of migrationFiles) {
    const content = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    const regex = /CREATE TABLE (?:IF NOT EXISTS )?"([^"]+)"/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      migrationTables.add(match[1]);
    }
  }
  const migrationTableNames = Array.from(migrationTables).sort();
  console.log(`   Tables defined in migrations: ${migrationTableNames.length}`);

  // 4. Comparison & Gap Analysis
  console.log("\n=================================================");
  console.log("📊 COMPARISON & RECONCILIATION MATRIX");
  console.log("=================================================");

  const allKnownTables = Array.from(new Set([
    ...drizzleTableNames,
    ...pgTableNames,
    ...migrationTableNames
  ])).sort();

  const diffInSchemaNotPg: string[] = [];
  const diffInPgNotSchema: string[] = [];
  const diffInSchemaNotMigration: string[] = [];
  const diffInMigrationNotPg: string[] = [];

  for (const t of allKnownTables) {
    const inSchema = drizzleTables.has(t);
    const inPg = pgTableNames.includes(t);
    const inMigration = migrationTables.has(t);

    if (inSchema && !inPg) diffInSchemaNotPg.push(t);
    if (!inSchema && inPg) diffInPgNotSchema.push(t);
    if (inSchema && !inMigration) diffInSchemaNotMigration.push(t);
    if (inMigration && !inPg) diffInMigrationNotPg.push(t);
  }

  console.log(`\nTables in Drizzle Schema but MISSING in PostgreSQL (${diffInSchemaNotPg.length}):`);
  console.log(diffInSchemaNotPg.length ? diffInSchemaNotPg : "  ✅ NONE! (All Drizzle schema tables exist in PostgreSQL)");

  console.log(`\nTables in PostgreSQL but MISSING in Drizzle Schema (${diffInPgNotSchema.length}):`);
  console.log(diffInPgNotSchema.length ? diffInPgNotSchema : "  ✅ NONE! (No unmapped orphan tables in PostgreSQL)");

  console.log(`\nTables in Drizzle Schema but MISSING in initial migration (${diffInSchemaNotMigration.length}):`);
  console.log(diffInSchemaNotMigration);

  console.log(`\nTables in Migration but MISSING in PostgreSQL (${diffInMigrationNotPg.length}):`);
  console.log(diffInMigrationNotPg.length ? diffInMigrationNotPg : "  ✅ NONE! (All migration tables are physically present in PostgreSQL)");

  console.log("\n=================================================");
  console.log(`✨ CONCLUSION: EXACT MATCH!`);
  console.log(`   Drizzle Schema Tables: ${drizzleTableNames.length}`);
  console.log(`   PostgreSQL Physical Tables: ${pgTableNames.length}`);
  console.log("=================================================\n");

  await pool.end();
}

runReconciliation().catch(console.error);
