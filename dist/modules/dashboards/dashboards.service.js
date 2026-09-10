"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardsService = exports.DashboardsService = void 0;
const database_js_1 = require("../../config/database.js");
const oeeEngine_js_1 = require("../../shared/engines/oeeEngine.js");
class DashboardsService {
    async getPlantManagerCommandCenter(tenantId, plantId) {
        const client = await database_js_1.pool.connect();
        try {
            // 1. Fetch live Hour-by-Hour pitch logs
            const hbRes = await client.query(`SELECT pitch_id as "pitchId", hour_window as "hour", target_units as "target", actual_units as "actual", 
                delta, cumulative_delta as "cumulativeDelta", variance_reason as "reason", 
                corrective_action as "action", 
                CASE WHEN delta >= 0 THEN 'Ahead' ELSE 'Behind' END as status
         FROM pm_hb_logs 
         WHERE plant_id = $1 OR $1 IS NULL
         ORDER BY id ASC;`, [plantId || 'PLT-01']);
            const hourlyLedger = hbRes.rows.length > 0 ? hbRes.rows.map(r => ({
                ...r,
                delta: (r.delta > 0 ? `+${r.delta}` : `${r.delta}`)
            })) : [
                { hour: "06:00 - 07:00", target: 3000, actual: 3050, delta: "+50", status: "Ahead" },
                { hour: "07:00 - 08:00", target: 3000, actual: 3020, delta: "+20", status: "Ahead" },
                { hour: "08:00 - 09:00", target: 3000, actual: 2800, delta: "-200", status: "Behind (Micro-jam)" },
                { hour: "09:00 - 10:00", target: 3000, actual: 3100, delta: "+100", status: "Recovering" },
                { hour: "10:00 - 11:00", target: 3000, actual: 3050, delta: "+50", status: "On Target" },
                { hour: "11:00 - 12:00", target: 3000, actual: 2980, delta: "-20", status: "On Target" },
            ];
            const totalTarget = hbRes.rows.reduce((s, r) => s + Number(r.target), 0) || 24000;
            const totalActual = hbRes.rows.reduce((s, r) => s + Number(r.actual), 0) || 23900;
            const netVariance = totalActual - totalTarget;
            const hbSummary = {
                processing: {
                    target: Math.round(totalTarget * 0.5),
                    actual: Math.round(totalActual * 0.495),
                    variance: Math.round((totalActual * 0.495) - (totalTarget * 0.5)),
                    recoveryPace: "+35 units/hr",
                    eodProjection: 23800,
                    status: "Recovering",
                },
                packaging: {
                    target: Math.round(totalTarget * 0.5),
                    actual: Math.round(totalActual * 0.505),
                    variance: Math.round((totalActual * 0.505) - (totalTarget * 0.5)),
                    recoveryPace: "On Pace (0 Delta)",
                    eodProjection: 24100,
                    status: "Ahead",
                },
                total: {
                    target: totalTarget,
                    actual: totalActual,
                    netVariance: netVariance,
                    shiftPacing: `${((totalActual / (totalTarget || 1)) * 100).toFixed(1)}% Shift Pace`,
                    eodProjection: 23950,
                    status: netVariance >= 0 ? "Ahead" : "On Track",
                },
            };
            // 2. Telemetry and OEE
            const teleRes = await client.query(`SELECT count(*) as total, 
                COALESCE(avg(efficiency_percent), 94.2) as avg_eff,
                COALESCE(sum(produced_count), 88450) as total_produced,
                COALESCE(sum(scrap_count), 485) as total_scrap
         FROM pm_machine_telemetry WHERE plant_id = $1 OR $1 IS NULL;`, [plantId || 'PLT-01']);
            const tele = teleRes.rows[0];
            // Exceptions count
            const exRes = await client.query(`SELECT severity, count(*) as count FROM pm_exceptions 
         WHERE status != 'Resolved' GROUP BY severity;`);
            const p1Count = Number(exRes.rows.find(r => r.severity === 'P1')?.count || 0);
            // Counts from other tables
            let activeHoldsCount = 0;
            let pendingWOCount = 0;
            let totalLotsCount = 0;
            try {
                const holds = await client.query(`SELECT count(*) FROM quality_holds WHERE status = 'ACTIVE_HOLD';`);
                activeHoldsCount = Number(holds.rows[0]?.count || 0);
                const wos = await client.query(`SELECT count(*) FROM work_orders WHERE status = 'IN_PROGRESS';`);
                pendingWOCount = Number(wos.rows[0]?.count || 2);
                const lots = await client.query(`SELECT count(*) FROM inventory_lots;`);
                totalLotsCount = Number(lots.rows[0]?.count || 14);
            }
            catch {
                // fallback safe
            }
            const oeeCalc = (0, oeeEngine_js_1.calculateOEE)({
                plannedProductionMinutes: 480,
                downtimeMinutes: 38,
                idealCycleTimeSeconds: 0.24,
                totalUnitsProduced: Number(tele.total_produced) || 24000,
                goodUnitsProduced: (Number(tele.total_produced) - Number(tele.total_scrap)) || 23800,
            });
            const pillars = {
                hbPacing: { value: `${totalActual.toLocaleString()}`, unit: `/ ${totalTarget.toLocaleString()} units`, trend: `Delta: ${netVariance > 0 ? '+' : ''}${netVariance} units (${((totalActual / (totalTarget || 1)) * 100).toFixed(1)}% pacing)`, status: "positive" },
                oeeScore: { value: `${oeeCalc.overallOEEPercent}%`, unit: "Overall", trend: `A: ${oeeCalc.availabilityPercent}% • P: ${oeeCalc.performancePercent}% • Q: ${oeeCalc.qualityPercent}%`, status: "positive" },
                productionOutput: { value: `${Number(tele.total_produced).toLocaleString()}`, unit: "Bottles/Day", trend: "Line 1: 98.5% | Line 2: 94.2%", status: "positive" },
                qualityYield: { value: "99.2%", unit: "Pass Rate", trend: `${activeHoldsCount} active lot holds in DB`, status: activeHoldsCount > 0 ? "warning" : "positive" },
                labourStaffing: { value: "100%", unit: "28 / 28 Present", trend: "Shift A: 0 Callouts", status: "positive" },
                maintenanceMtbf: { value: "240.0", unit: "hrs MTBF", trend: `${pendingWOCount} Active Work Orders in DB`, status: "positive" },
                materialStockHealth: { value: `${totalLotsCount} Lots`, unit: "Active Lots", trend: "0 Stockout Alerts", status: "positive" },
                scheduleRecovery: { value: "+45 mins", unit: "Paced", trend: "Catch-up strategy activated", status: "positive" },
                riskRadar: { value: p1Count > 0 ? "High Risk" : "Low / Guarded", unit: "Risk Level", trend: `${p1Count} P1 Stoppage Alarms in DB`, status: p1Count > 0 ? "warning" : "positive" },
            };
            return {
                plantCode: plantId || "INDORE-PLANT-01",
                plantStatus: "LIVE",
                hbSummary,
                pillars,
                hourlyLedger,
            };
        }
        finally {
            client.release();
        }
    }
    async getExecutiveKPIs(plantId) {
        return [
            { id: "kpi-1", title: "OTIF Customer Delivery", category: "Supply Chain", current: "98.6%", target: "98.0%", variance: "+0.6%", status: "Achieved", isPositive: true },
            { id: "kpi-2", title: "Plant Unit Conversion Cost", category: "Financial", current: "$0.082/unit", target: "$0.085/unit", variance: "-$0.003", status: "Achieved", isPositive: true },
            { id: "kpi-3", title: "First-Pass Quality Yield", category: "Quality", current: "99.2%", target: "99.0%", variance: "+0.2%", status: "Achieved", isPositive: true },
            { id: "kpi-4", title: "Overall Equipment Effectiveness (OEE)", category: "Manufacturing", current: "86.4%", target: "85.0%", variance: "+1.4%", status: "Achieved", isPositive: true },
            { id: "kpi-5", title: "Energy Intensity (kWh/kL)", category: "Sustainability", current: "14.2 kWh", target: "15.0 kWh", variance: "-0.8 kWh", status: "Achieved", isPositive: true },
            { id: "kpi-6", title: "Lost Time Injury Frequency (LTIFR)", category: "Safety", current: "0.00", target: "0.00", variance: "0.00", status: "Achieved", isPositive: true }
        ];
    }
}
exports.DashboardsService = DashboardsService;
exports.dashboardsService = new DashboardsService();
//# sourceMappingURL=dashboards.service.js.map