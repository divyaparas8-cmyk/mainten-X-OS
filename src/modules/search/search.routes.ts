import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function searchRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get(
    "/",
    {
      schema: {
        tags: ["Global Search"],
        summary: "Universal Manufacturing Search",
        querystring: {
          type: "object",
          properties: {
            q: { type: "string" },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: { q?: string } }>, reply: FastifyReply) => {
      const q = (request.query.q || "").toLowerCase().trim();

      const searchIndex = [
        {
          type: "360° Traceability Lot",
          code: "LOT-RM-ORG-4402",
          title: "LOT-RM-ORG-4402 — Valencia Organic Orange Juice Concentrate 65° Brix",
          subtitle: "Raw Material Lot • Supplier: SunGrow Organic Citrus Ltd",
          route: "/warehouse/traceability",
        },
        {
          type: "360° Traceability Lot",
          code: "LOT-FG-2026-0885",
          title: "LOT-FG-2026-0885 — Sparkling Organic Orange Soda 330ml Can",
          subtitle: "Finished Good Lot • 21 CFR QA Released",
          route: "/warehouse/traceability",
        },
        {
          type: "Production Batch (eBR)",
          code: "BAT-2026-0885",
          title: "BAT-2026-0885 — Sparkling Organic Orange Soda",
          subtitle: "Tank T-01 • Progress: 80% • Step 4 CCP Check",
          route: "/production/batches",
        },
        {
          type: "Production Order",
          code: "PO-2026-001",
          title: "PO-2026-001 — 500ml Sparkling Citrus Soda",
          subtitle: "Line 1 Bottling • Target: 10,000 Units • Status: RUNNING",
          route: "/production/orders",
        },
        {
          type: "Critical Control Point",
          code: "CCP-1",
          title: "CCP-1 — Pasteurizer Thermal Kill Step (≥83.1°C)",
          subtitle: "HACCP Parameter • Current: 83.4°C (PASS)",
          route: "/quality/checks/ccp",
        },
        {
          type: "Asset / Machine",
          code: "FM-001",
          title: "FM-001 - Rotary Filling Machine",
          subtitle: "Line 1 Bottling • Health: 92% (MTBF 412.5 hrs)",
          route: "/assets/360?id=FM-001",
        },
        {
          type: "Work Order",
          code: "WO-2026-0891",
          title: "WO-2026-0891 - Fill Valve Seal Gasket Replacement",
          subtitle: "FM-001 • Status: IN_PROGRESS • Priority: HIGH",
          route: "/work-orders/open?view=WO-2026-0891",
        },
      ];

      const matches = !q
        ? searchIndex.slice(0, 5)
        : searchIndex.filter((item) => item.code.toLowerCase().includes(q) || item.title.toLowerCase().includes(q) || item.type.toLowerCase().includes(q));

      return reply.send(formatSuccess(matches));
    }
  );
}
