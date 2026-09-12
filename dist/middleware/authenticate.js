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
        // JWT verification failed — continue to header-based scoping
    }
    const currentUser = request.user;
    // 1. If JWT decoded successfully
    if (currentUser) {
        if (headerTenantId) {
            // If user is master admin or switching tenant context, honor the header
            if (currentUser.isMasterAdmin || !currentUser.tenantId) {
                currentUser.tenantId = headerTenantId;
            }
        }
        return;
    }
    // 2. If JWT was missing or invalid, but X-Tenant-Id header was provided
    if (headerTenantId) {
        try {
            const [t] = await database_js_1.db.select().from(index_js_1.tenants).where((0, drizzle_orm_1.eq)(index_js_1.tenants.id, headerTenantId)).limit(1);
            if (t) {
                request.user = {
                    id: `admin-${t.id}`,
                    tenantId: t.id,
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
                request.user = {
                    id: `admin-${t.id}`,
                    tenantId: t.id,
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
    // 4. If no tenant context is established, do NOT attach a random tenant
    request.user = undefined;
}
//# sourceMappingURL=authenticate.js.map