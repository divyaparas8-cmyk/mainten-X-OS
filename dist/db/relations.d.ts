export declare const tenantsRelations: import("drizzle-orm").Relations<"tenants", {
    plants: import("drizzle-orm").Many<"plants">;
    users: import("drizzle-orm").Many<"users">;
    skus: import("drizzle-orm").Many<"skus">;
    routings: import("drizzle-orm").Many<"routings">;
}>;
export declare const plantsRelations: import("drizzle-orm").Relations<"plants", {
    tenant: import("drizzle-orm").One<"tenants", true>;
    lines: import("drizzle-orm").Many<"production_lines">;
    assets: import("drizzle-orm").Many<"assets">;
    routings: import("drizzle-orm").Many<"routings">;
}>;
export declare const usersRelations: import("drizzle-orm").Relations<"users", {
    tenant: import("drizzle-orm").One<"tenants", true>;
    userRoles: import("drizzle-orm").Many<"user_roles">;
}>;
export declare const rolesRelations: import("drizzle-orm").Relations<"roles", {
    userRoles: import("drizzle-orm").Many<"user_roles">;
    rolePermissions: import("drizzle-orm").Many<"role_permissions">;
}>;
export declare const skusRelations: import("drizzle-orm").Relations<"skus", {
    boms: import("drizzle-orm").Many<"boms">;
    productionOrders: import("drizzle-orm").Many<"production_orders">;
    inventoryLots: import("drizzle-orm").Many<"inventory_lots">;
    routings: import("drizzle-orm").Many<"routings">;
}>;
export declare const bomsRelations: import("drizzle-orm").Relations<"boms", {
    sku: import("drizzle-orm").One<"skus", true>;
    items: import("drizzle-orm").Many<"bom_items">;
}>;
export declare const bomItemsRelations: import("drizzle-orm").Relations<"bom_items", {
    bom: import("drizzle-orm").One<"boms", true>;
    componentSku: import("drizzle-orm").One<"skus", true>;
}>;
export declare const productionOrdersRelations: import("drizzle-orm").Relations<"production_orders", {
    sku: import("drizzle-orm").One<"skus", true>;
    line: import("drizzle-orm").One<"production_lines", true>;
    batches: import("drizzle-orm").Many<"batches">;
}>;
export declare const batchesRelations: import("drizzle-orm").Relations<"batches", {
    productionOrder: import("drizzle-orm").One<"production_orders", true>;
    sku: import("drizzle-orm").One<"skus", true>;
    steps: import("drizzle-orm").Many<"batch_steps">;
    ccpChecks: import("drizzle-orm").Many<"ccp_checks">;
    qaRelease: import("drizzle-orm").One<"qa_releases", true>;
}>;
export declare const batchStepsRelations: import("drizzle-orm").Relations<"batch_steps", {
    batch: import("drizzle-orm").One<"batches", true>;
    operator: import("drizzle-orm").One<"users", false>;
}>;
export declare const ccpChecksRelations: import("drizzle-orm").Relations<"ccp_checks", {
    batch: import("drizzle-orm").One<"batches", true>;
    line: import("drizzle-orm").One<"production_lines", true>;
}>;
export declare const inventoryLotsRelations: import("drizzle-orm").Relations<"inventory_lots", {
    sku: import("drizzle-orm").One<"skus", true>;
    transactions: import("drizzle-orm").Many<"inventory_transactions">;
    parentGenealogies: import("drizzle-orm").Many<"lot_genealogies">;
    childGenealogies: import("drizzle-orm").Many<"lot_genealogies">;
}>;
export declare const workOrdersRelations: import("drizzle-orm").Relations<"work_orders", {
    asset: import("drizzle-orm").One<"assets", true>;
    assignedUser: import("drizzle-orm").One<"users", false>;
}>;
export declare const routingsRelations: import("drizzle-orm").Relations<"routings", {
    tenant: import("drizzle-orm").One<"tenants", true>;
    plant: import("drizzle-orm").One<"plants", false>;
    sku: import("drizzle-orm").One<"skus", true>;
    line: import("drizzle-orm").One<"production_lines", false>;
    steps: import("drizzle-orm").Many<"routing_steps">;
}>;
export declare const routingStepsRelations: import("drizzle-orm").Relations<"routing_steps", {
    routing: import("drizzle-orm").One<"routings", true>;
    workCenter: import("drizzle-orm").One<"work_centers", false>;
}>;
//# sourceMappingURL=relations.d.ts.map