"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
async function sync() {
    try {
        const bds = await database_js_1.pool.query(`SELECT d.*, a.name as asset_name, a.asset_code 
       FROM downtime_logs d 
       LEFT JOIN assets a ON d.asset_id = a.id`);
        console.log("Found downtime logs:", bds.rows.length);
        for (const b of bds.rows) {
            const assetCode = b.asset_code || "AST-001";
            const assetName = b.asset_name || "Equipment Station";
            const stage = "PACKAGING";
            const durationMins = Number(b.duration_minutes) || 30;
            const hoursLost = (durationMins / 60).toFixed(2);
            const estLossUsd = durationMins * 25;
            const lossId = "LOSS-BD-" + b.id.slice(0, 8).toUpperCase();
            await database_js_1.pool.query(`INSERT INTO ci_losses (
          id, category, plant_id, line_id, asset_id, stage, event_name,
          hours_lost, units_lost, financial_impact_usd, date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE::text)
        ON CONFLICT (id) DO UPDATE SET financial_impact_usd = EXCLUDED.financial_impact_usd`, [
                lossId,
                "Downtime Loss",
                b.plant_id,
                b.line_id || "LIN-01",
                assetCode,
                stage,
                `Emergency Breakdown: ${assetName} — ${b.comments || b.reason_code}`,
                hoursLost,
                500,
                estLossUsd,
            ]);
            const relId = "REL-" + assetCode;
            await database_js_1.pool.query(`INSERT INTO ci_reliability_records (
          id, asset_id, asset_name, line_id, line_name, plant_id,
          failures_count, total_downtime_min, mtbf_hrs, mttr_min, last_failure_date,
          failure_category, stage, criticality, is_bad_actor, bad_actor_reason
        ) VALUES (
          $1, $2, $3, $4, $5, $6, 1, $7, 180, $7, CURRENT_DATE::text,
          $8, $9, $10, true, $11
        )
        ON CONFLICT (id) DO UPDATE SET
          failures_count = ci_reliability_records.failures_count + 1,
          total_downtime_min = ci_reliability_records.total_downtime_min + EXCLUDED.total_downtime_min,
          is_bad_actor = true,
          bad_actor_reason = EXCLUDED.bad_actor_reason`, [
                relId,
                assetCode,
                assetName,
                b.line_id || "LIN-01",
                "Production Line",
                b.plant_id,
                durationMins,
                b.category || "Mechanical",
                stage,
                "Critical",
                b.comments || "Repeat critical stoppage reported",
            ]);
        }
        console.log("Successfully synced all downtime logs into CI tables!");
    }
    catch (err) {
        console.error("Error syncing downtime to CI:", err.message);
    }
    finally {
        await database_js_1.pool.end();
    }
}
sync();
