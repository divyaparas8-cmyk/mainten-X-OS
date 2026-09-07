import { FastifyInstance } from "fastify";
import { warehouseController } from "./warehouse.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function warehouseRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/lots", { schema: { tags: ["Warehouse & WMS"], summary: "List Inventory Lots (Raw, Packaging, Finished Goods)" } }, warehouseController.getLots.bind(warehouseController));
  fastify.post("/lots", { schema: { tags: ["Warehouse & WMS"], summary: "Create / Receive New Lot" } }, warehouseController.createLot.bind(warehouseController));
  fastify.post("/transactions", { schema: { tags: ["Warehouse & WMS"], summary: "Log Auditable Stock Movement / Adjustment" } }, warehouseController.recordTransaction.bind(warehouseController));

  fastify.get("/warehouses", { schema: { tags: ["Warehouse & WMS"], summary: "List Warehouses" } }, warehouseController.getWarehouses.bind(warehouseController));
  fastify.get("/bins", { schema: { tags: ["Warehouse & WMS"], summary: "List Location Bins & Racks" } }, warehouseController.getBins.bind(warehouseController));
}
