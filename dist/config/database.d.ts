import pg from "pg";
import * as schema from "../db/schema/index.js";
export declare const pool: pg.Pool;
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: pg.Pool;
};
export declare function checkDatabaseConnection(): Promise<boolean>;
//# sourceMappingURL=database.d.ts.map