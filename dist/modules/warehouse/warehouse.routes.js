"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseRoutes = warehouseRoutes;
const warehouse_controller_js_1 = require("./warehouse.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function warehouseRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    fastify.get("/lots", { schema: { tags: ["Warehouse & WMS"], summary: "List Inventory Lots (Raw, Packaging, Finished Goods)" } }, warehouse_controller_js_1.warehouseController.getLots.bind(warehouse_controller_js_1.warehouseController));
    fastify.post("/lots", { schema: { tags: ["Warehouse & WMS"], summary: "Create / Receive New Lot" } }, warehouse_controller_js_1.warehouseController.createLot.bind(warehouse_controller_js_1.warehouseController));
    fastify.get("/transactions", { schema: { tags: ["Warehouse & WMS"], summary: "List Stock Movement Transactions" } }, warehouse_controller_js_1.warehouseController.getTransactions.bind(warehouse_controller_js_1.warehouseController));
    fastify.post("/transactions", { schema: { tags: ["Warehouse & WMS"], summary: "Log Auditable Stock Movement / Adjustment" } }, warehouse_controller_js_1.warehouseController.recordTransaction.bind(warehouse_controller_js_1.warehouseController));
    fastify.get("/warehouses", { schema: { tags: ["Warehouse & WMS"], summary: "List Warehouses" } }, warehouse_controller_js_1.warehouseController.getWarehouses.bind(warehouse_controller_js_1.warehouseController));
    fastify.get("/bins", { schema: { tags: ["Warehouse & WMS"], summary: "List Location Bins & Racks" } }, warehouse_controller_js_1.warehouseController.getBins.bind(warehouse_controller_js_1.warehouseController));
}
//# sourceMappingURL=warehouse.routes.js.map