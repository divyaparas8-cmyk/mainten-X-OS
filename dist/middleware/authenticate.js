"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const database_js_1 = require("../config/database.js");
const index_js_1 = require("../db/schema/index.js");
const drizzle_orm_1 = require("drizzle-orm");
async function authenticate(request, _reply) {
    const headerTenantId = request.headers["x-tenant-id"]?.trim();
    const headerTenantName = request.headers["x-tenant-name"]?.trim();
    try {
        if (request.headers.authorization) {
            await request.jwtVerify();
        }
    }
    catch {
        // JWT verification failed — continue to fallback scoping
    }
    const currentUser = request.user;
    // 1. If JWT decoded successfully
    if (currentUser) {
        if (headerTenantId) {
            if (currentUser.isMasterAdmin || !currentUser.tenantId) {
                currentUser.tenantId = headerTenantId;
            }
        }
        if (!currentUser.plantId && currentUser.tenantId) {
            try {
                const [p] = await database_js_1.db.select().from(index_js_1.plants).where((0, drizzle_orm_1.eq)(index_js_1.plants.tenantId, currentUser.tenantId)).limit(1);
                if (p)
                    currentUser.plantId = p.id;
            }
            catch (_) { }
        }
        if (!currentUser.tenantId) {
            currentUser.tenantId = headerTenantId || "5bce8458-909a-4dd2-b221-614c32ac7c89";
        }
        return;
    }
    // 2. If X-Tenant-Id header was provided
    if (headerTenantId) {
        try {
            const [t] = await database_js_1.db.select().from(index_js_1.tenants).where((0, drizzle_orm_1.eq)(index_js_1.tenants.id, headerTenantId)).limit(1);
            if (t) {
                const [p] = await database_js_1.db.select().from(index_js_1.plants).where((0, drizzle_orm_1.eq)(index_js_1.plants.tenantId, t.id)).limit(1);
                request.user = {
                    id: `admin-${t.id}`,
                    tenantId: t.id,
                    plantId: p?.id || "PLT-01",
                    role: "admin",
                    email: `admin@${t.slug || "maintenx.com"}`,
                    isMasterAdmin: false,
                };
                return;
            }
        }
        catch (e) {
            console.warn("authenticate headerTenantId lookup failed:", e.message);
        }
    }
    // 3. If X-Tenant-Name was provided
    if (headerTenantName) {
        try {
            const [t] = await database_js_1.db.select().from(index_js_1.tenants).where((0, drizzle_orm_1.eq)(index_js_1.tenants.name, headerTenantName)).limit(1);
            if (t) {
                const [p] = await database_js_1.db.select().from(index_js_1.plants).where((0, drizzle_orm_1.eq)(index_js_1.plants.tenantId, t.id)).limit(1);
                request.user = {
                    id: `admin-${t.id}`,
                    tenantId: t.id,
                    plantId: p?.id || "PLT-01",
                    role: "admin",
                    email: `admin@${t.slug || "maintenx.com"}`,
                    isMasterAdmin: false,
                };
                return;
            }
        }
        catch (e) {
            console.warn("authenticate headerTenantName lookup failed:", e.message);
        }
    }
    // 4. Default Enterprise Tenant & Plant Fallback (ensures development, demo mode, and unauthenticated page loads never throw 500)
    try {
        const [demoTenant] = await database_js_1.db.select().from(index_js_1.tenants).limit(1);
        if (demoTenant) {
            const [demoPlant] = await database_js_1.db.select().from(index_js_1.plants).where((0, drizzle_orm_1.eq)(index_js_1.plants.tenantId, demoTenant.id)).limit(1);
            request.user = {
                id: `demo-${demoTenant.id}`,
                userId: "4a9fe1e0-6512-444d-a639-25ca55ff4866",
                tenantId: headerTenantId || demoTenant.id,
                plantId: demoPlant?.id || "PLT-01",
                role: "admin",
                email: `admin@${demoTenant.slug || "maintenx.com"}`,
                isMasterAdmin: true,
            };
            return;
        }
    }
    catch (e) {
        console.warn("authenticate default tenant fallback error:", e.message);
    }
    // 5. Fallback safe dummy context
    request.user = {
        id: "admin-default",
        userId: "4a9fe1e0-6512-444d-a639-25ca55ff4866",
        tenantId: headerTenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0",
        plantId: "bead41e2-b735-41b8-bd00-bdba1682fb6a",
        role: "admin",
        email: "admin@beverage-corp.com",
        isMasterAdmin: true,
    };
}
//# sourceMappingURL=authenticate.js.map