"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryTransactionsRelations = exports.routingStepsRelations = exports.routingsRelations = exports.workOrdersRelations = exports.inventoryLotsRelations = exports.ccpChecksRelations = exports.batchStepsRelations = exports.batchesRelations = exports.productionOrdersRelations = exports.bomItemsRelations = exports.bomsRelations = exports.skusRelations = exports.rolesRelations = exports.usersRelations = exports.plantsRelations = exports.tenantsRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const tenants_js_1 = require("./schema/tenants.js");
const users_js_1 = require("./schema/users.js");
const masterData_js_1 = require("./schema/masterData.js");
const production_js_1 = require("./schema/production.js");
const quality_js_1 = require("./schema/quality.js");
const warehouse_js_1 = require("./schema/warehouse.js");
const traceability_js_1 = require("./schema/traceability.js");
const maintenance_js_1 = require("./schema/maintenance.js");
exports.tenantsRelations = (0, drizzle_orm_1.relations)(tenants_js_1.tenants, ({ many }) => ({
    plants: many(tenants_js_1.plants),
    users: many(users_js_1.users),
    skus: many(masterData_js_1.skus),
    routings: many(masterData_js_1.routings),
}));
exports.plantsRelations = (0, drizzle_orm_1.relations)(tenants_js_1.plants, ({ one, many }) => ({
    tenant: one(tenants_js_1.tenants, { fields: [tenants_js_1.plants.tenantId], references: [tenants_js_1.tenants.id] }),
    lines: many(masterData_js_1.productionLines),
    assets: many(masterData_js_1.assets),
    routings: many(masterData_js_1.routings),
}));
exports.usersRelations = (0, drizzle_orm_1.relations)(users_js_1.users, ({ one, many }) => ({
    tenant: one(tenants_js_1.tenants, { fields: [users_js_1.users.tenantId], references: [tenants_js_1.tenants.id] }),
    userRoles: many(users_js_1.userRoles),
}));
exports.rolesRelations = (0, drizzle_orm_1.relations)(users_js_1.roles, ({ many }) => ({
    userRoles: many(users_js_1.userRoles),
    rolePermissions: many(users_js_1.rolePermissions),
}));
exports.skusRelations = (0, drizzle_orm_1.relations)(masterData_js_1.skus, ({ many }) => ({
    boms: many(masterData_js_1.boms),
    productionOrders: many(production_js_1.productionOrders),
    inventoryLots: many(warehouse_js_1.inventoryLots),
    routings: many(masterData_js_1.routings),
}));
exports.bomsRelations = (0, drizzle_orm_1.relations)(masterData_js_1.boms, ({ one, many }) => ({
    sku: one(masterData_js_1.skus, { fields: [masterData_js_1.boms.skuId], references: [masterData_js_1.skus.id] }),
    items: many(masterData_js_1.bomItems),
}));
exports.bomItemsRelations = (0, drizzle_orm_1.relations)(masterData_js_1.bomItems, ({ one }) => ({
    bom: one(masterData_js_1.boms, { fields: [masterData_js_1.bomItems.bomId], references: [masterData_js_1.boms.id] }),
    componentSku: one(masterData_js_1.skus, { fields: [masterData_js_1.bomItems.componentSkuId], references: [masterData_js_1.skus.id] }),
}));
exports.productionOrdersRelations = (0, drizzle_orm_1.relations)(production_js_1.productionOrders, ({ one, many }) => ({
    sku: one(masterData_js_1.skus, { fields: [production_js_1.productionOrders.skuId], references: [masterData_js_1.skus.id] }),
    line: one(masterData_js_1.productionLines, { fields: [production_js_1.productionOrders.lineId], references: [masterData_js_1.productionLines.id] }),
    batches: many(production_js_1.batches),
}));
exports.batchesRelations = (0, drizzle_orm_1.relations)(production_js_1.batches, ({ one, many }) => ({
    productionOrder: one(production_js_1.productionOrders, { fields: [production_js_1.batches.productionOrderId], references: [production_js_1.productionOrders.id] }),
    sku: one(masterData_js_1.skus, { fields: [production_js_1.batches.skuId], references: [masterData_js_1.skus.id] }),
    steps: many(production_js_1.batchSteps),
    ccpChecks: many(quality_js_1.ccpChecks),
    qaRelease: one(quality_js_1.qaReleases, { fields: [production_js_1.batches.id], references: [quality_js_1.qaReleases.batchId] }),
}));
exports.batchStepsRelations = (0, drizzle_orm_1.relations)(production_js_1.batchSteps, ({ one }) => ({
    batch: one(production_js_1.batches, { fields: [production_js_1.batchSteps.batchId], references: [production_js_1.batches.id] }),
    operator: one(users_js_1.users, { fields: [production_js_1.batchSteps.operatorId], references: [users_js_1.users.id] }),
}));
exports.ccpChecksRelations = (0, drizzle_orm_1.relations)(quality_js_1.ccpChecks, ({ one }) => ({
    batch: one(production_js_1.batches, { fields: [quality_js_1.ccpChecks.batchId], references: [production_js_1.batches.id] }),
    line: one(masterData_js_1.productionLines, { fields: [quality_js_1.ccpChecks.lineId], references: [masterData_js_1.productionLines.id] }),
}));
exports.inventoryLotsRelations = (0, drizzle_orm_1.relations)(warehouse_js_1.inventoryLots, ({ one, many }) => ({
    sku: one(masterData_js_1.skus, { fields: [warehouse_js_1.inventoryLots.skuId], references: [masterData_js_1.skus.id] }),
    transactions: many(warehouse_js_1.inventoryTransactions),
    parentGenealogies: many(traceability_js_1.lotGenealogies, { relationName: "parentLot" }),
    childGenealogies: many(traceability_js_1.lotGenealogies, { relationName: "childLot" }),
}));
exports.workOrdersRelations = (0, drizzle_orm_1.relations)(maintenance_js_1.workOrders, ({ one }) => ({
    asset: one(masterData_js_1.assets, { fields: [maintenance_js_1.workOrders.assetId], references: [masterData_js_1.assets.id] }),
    assignedUser: one(users_js_1.users, { fields: [maintenance_js_1.workOrders.assignedTo], references: [users_js_1.users.id] }),
}));
exports.routingsRelations = (0, drizzle_orm_1.relations)(masterData_js_1.routings, ({ one, many }) => ({
    tenant: one(tenants_js_1.tenants, { fields: [masterData_js_1.routings.tenantId], references: [tenants_js_1.tenants.id] }),
    plant: one(tenants_js_1.plants, { fields: [masterData_js_1.routings.plantId], references: [tenants_js_1.plants.id] }),
    sku: one(masterData_js_1.skus, { fields: [masterData_js_1.routings.skuId], references: [masterData_js_1.skus.id] }),
    line: one(masterData_js_1.productionLines, { fields: [masterData_js_1.routings.lineId], references: [masterData_js_1.productionLines.id] }),
    steps: many(masterData_js_1.routingSteps),
}));
exports.routingStepsRelations = (0, drizzle_orm_1.relations)(masterData_js_1.routingSteps, ({ one }) => ({
    routing: one(masterData_js_1.routings, { fields: [masterData_js_1.routingSteps.routingId], references: [masterData_js_1.routings.id] }),
    workCenter: one(masterData_js_1.workCenters, { fields: [masterData_js_1.routingSteps.workCenterId], references: [masterData_js_1.workCenters.id] }),
}));
exports.inventoryTransactionsRelations = (0, drizzle_orm_1.relations)(warehouse_js_1.inventoryTransactions, ({ one }) => ({
    lot: one(warehouse_js_1.inventoryLots, { fields: [warehouse_js_1.inventoryTransactions.lotId], references: [warehouse_js_1.inventoryLots.id] }),
    performedByUser: one(users_js_1.users, { fields: [warehouse_js_1.inventoryTransactions.performedBy], references: [users_js_1.users.id] }),
}));
//# sourceMappingURL=relations.js.map