import { relations } from "drizzle-orm";
import { tenants, plants } from "./schema/tenants.js";
import { users, roles, permissions, userRoles, rolePermissions } from "./schema/users.js";
import { skus, boms, bomItems, productionLines, workCenters, assets } from "./schema/masterData.js";
import { customerOrders, apsSchedules, mrpRequirements } from "./schema/planning.js";
import { productionOrders, batches, batchSteps, downtimeLogs, shiftLogs } from "./schema/production.js";
import { ccpChecks, qaReleases } from "./schema/quality.js";
import { inventoryLots, inventoryTransactions } from "./schema/warehouse.js";
import { lotGenealogies } from "./schema/traceability.js";
import { workOrders, pmSchedules, spareParts } from "./schema/maintenance.js";

export const tenantsRelations = relations(tenants, ({ many }) => ({
  plants: many(plants),
  users: many(users),
  skus: many(skus),
}));

export const plantsRelations = relations(plants, ({ one, many }) => ({
  tenant: one(tenants, { fields: [plants.tenantId], references: [tenants.id] }),
  lines: many(productionLines),
  assets: many(assets),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, { fields: [users.tenantId], references: [tenants.id] }),
  userRoles: many(userRoles),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const skusRelations = relations(skus, ({ many }) => ({
  boms: many(boms),
  productionOrders: many(productionOrders),
  inventoryLots: many(inventoryLots),
}));

export const bomsRelations = relations(boms, ({ one, many }) => ({
  sku: one(skus, { fields: [boms.skuId], references: [skus.id] }),
  items: many(bomItems),
}));

export const bomItemsRelations = relations(bomItems, ({ one }) => ({
  bom: one(boms, { fields: [bomItems.bomId], references: [boms.id] }),
  componentSku: one(skus, { fields: [bomItems.componentSkuId], references: [skus.id] }),
}));

export const productionOrdersRelations = relations(productionOrders, ({ one, many }) => ({
  sku: one(skus, { fields: [productionOrders.skuId], references: [skus.id] }),
  line: one(productionLines, { fields: [productionOrders.lineId], references: [productionLines.id] }),
  batches: many(batches),
}));

export const batchesRelations = relations(batches, ({ one, many }) => ({
  productionOrder: one(productionOrders, { fields: [batches.productionOrderId], references: [productionOrders.id] }),
  sku: one(skus, { fields: [batches.skuId], references: [skus.id] }),
  steps: many(batchSteps),
  ccpChecks: many(ccpChecks),
  qaRelease: one(qaReleases, { fields: [batches.id], references: [qaReleases.batchId] }),
}));

export const batchStepsRelations = relations(batchSteps, ({ one }) => ({
  batch: one(batches, { fields: [batchSteps.batchId], references: [batches.id] }),
  operator: one(users, { fields: [batchSteps.operatorId], references: [users.id] }),
}));

export const ccpChecksRelations = relations(ccpChecks, ({ one }) => ({
  batch: one(batches, { fields: [ccpChecks.batchId], references: [batches.id] }),
  line: one(productionLines, { fields: [ccpChecks.lineId], references: [productionLines.id] }),
}));

export const inventoryLotsRelations = relations(inventoryLots, ({ one, many }) => ({
  sku: one(skus, { fields: [inventoryLots.skuId], references: [skus.id] }),
  transactions: many(inventoryTransactions),
  parentGenealogies: many(lotGenealogies, { relationName: "parentLot" }),
  childGenealogies: many(lotGenealogies, { relationName: "childLot" }),
}));

export const workOrdersRelations = relations(workOrders, ({ one }) => ({
  asset: one(assets, { fields: [workOrders.assetId], references: [assets.id] }),
  assignedUser: one(users, { fields: [workOrders.assignedTo], references: [users.id] }),
}));
