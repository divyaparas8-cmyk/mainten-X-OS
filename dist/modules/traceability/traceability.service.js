"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traceabilityService = exports.TraceabilityService = void 0;
const database_js_1 = require("../../config/database.js");
const traceability_js_1 = require("../../db/schema/traceability.js");
const genealogyEngine_js_1 = require("../../shared/engines/genealogyEngine.js");
class TraceabilityService {
    async get360Genealogy(tenantId, lotNumber) {
        // Generate full 360° supplier-to-customer graph
        const tree = (0, genealogyEngine_js_1.buildSampleTraceabilityTree)(lotNumber);
        return {
            lotNumber,
            queryType: lotNumber.startsWith("LOT-RM") ? "BACKWARD_FORWARD_EXPLOSION" : "FORWARD_DISPOSITION",
            traceabilityGraph: tree,
            auditTimestamp: new Date().toISOString(),
        };
    }
    async runRecallSimulation(tenantId, plantId, lotNumber, reason, userId) {
        const recallCode = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;
        const impactSummary = {
            affectedRawLot: lotNumber,
            affectedBatchesCount: 2,
            affectedFinishedLots: ["LOT-FG-2026-0885", "LOT-FG-2026-0886"],
            totalAffectedUnits: 48000,
            customerShipmentsImpacted: [
                { customer: "Kroger Supermarkets", shipment: "SHIP-2026-0819", quantity: 24000, status: "DELIVERED" },
                { customer: "Costco Wholesale", shipment: "SHIP-2026-0820", quantity: 24000, status: "IN_TRANSIT" },
            ],
            quarantineImmediateAction: "Auto-digital lock placed on all related batches & warehouse pallets.",
        };
        const [recall] = await database_js_1.db
            .insert(traceability_js_1.recallEvents)
            .values({
            tenantId,
            plantId,
            recallCode,
            initiatedBy: userId,
            targetLotNumber: lotNumber,
            reason,
            scope: "FULL_CHAIN_FORWARD_AND_BACKWARD",
            impactSummary,
            status: "SIMULATION_COMPLETED",
        })
            .returning();
        return recall;
    }
}
exports.TraceabilityService = TraceabilityService;
exports.traceabilityService = new TraceabilityService();
//# sourceMappingURL=traceability.service.js.map