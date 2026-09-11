"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_js_1 = require("./config/database.js");
const index_js_1 = require("./db/schema/index.js");
const drizzle_orm_1 = require("drizzle-orm");
async function main() {
    console.log("Seeding system roles and users...");
    // 1. Get Tenant
    const [demoTenant] = await database_js_1.db.select().from(index_js_1.tenants).where((0, drizzle_orm_1.eq)(index_js_1.tenants.slug, "beverage-corp")).limit(1);
    if (!demoTenant) {
        throw new Error("Demo tenant 'beverage-corp' not found");
    }
    // 2. Get Plant
    const [indorePlant] = await database_js_1.db.select().from(index_js_1.plants).where((0, drizzle_orm_1.eq)(index_js_1.plants.code, "INDORE-01")).limit(1);
    if (!indorePlant) {
        throw new Error("Indore plant not found");
    }
    // 3. Password and Pin hashes
    const passwordHash = await bcryptjs_1.default.hash("Password@123", 10);
    const pinHash = await bcryptjs_1.default.hash("1234", 10);
    // 4. Role Definitions
    const roleDefinitions = [
        { code: "master_admin", name: "Master Admin", description: "Platform Chief Administrator & SuperAdmin" },
        { code: "admin", name: "System Administrator", description: "Indore IT & System Configuration Administrator" },
        { code: "planner", name: "Planner / Scheduler", description: "Lead Production & Demand Scheduler" },
        { code: "warehouse", name: "Warehouse / Receiver", description: "Warehouse, Receiving & Logistics Manager" },
        { code: "maintenance", name: "Maintenance", description: "Senior Reliability Technician & Maintenance Lead" },
        { code: "supervisor", name: "Operations Supervisor", description: "Shift Operations & Workforce Supervisor" },
        { code: "line_lead", name: "Line Lead", description: "Line Lead - Packaging & Bottling" },
        { code: "operator", name: "Line Operator", description: "Certified HMI Line Operator" },
        { code: "quality", name: "Quality / QA", description: "Quality Assurance & Food Safety Lead" },
        { code: "ci_engineer", name: "CI / Engineering", description: "Continuous Improvement & RCA Engineer" },
        { code: "plant_manager", name: "Plant Manager", description: "Indore Plant Director & Operations Lead" },
        { code: "executive", name: "Executive", description: "Chief Operating Officer & Enterprise Executive" },
    ];
    const seededRoles = {};
    for (const r of roleDefinitions) {
        let [existingRole] = await database_js_1.db.select().from(index_js_1.roles).where((0, drizzle_orm_1.eq)(index_js_1.roles.code, r.code)).limit(1);
        if (!existingRole) {
            [existingRole] = await database_js_1.db
                .insert(index_js_1.roles)
                .values({
                tenantId: demoTenant.id,
                code: r.code,
                name: r.name,
                description: r.description,
                isSystem: true,
            })
                .returning();
            console.log(`Created role: ${r.code}`);
        }
        else {
            console.log(`Role already exists: ${r.code}`);
        }
        seededRoles[r.code] = existingRole;
    }
    // 5. User Definitions
    const userDefinitions = [
        { email: "plant.manager@maintenx.com", firstName: "Arthur", lastName: "Sterling", roleCode: "plant_manager" },
        { email: "alexander.vance@maintenx.com", firstName: "Alexander", lastName: "Vance", roleCode: "plant_manager" },
        { email: "admin@maintenx.com", firstName: "Alexander", lastName: "Vance", roleCode: "admin" },
        { email: "planner@maintenx.com", firstName: "Elena", lastName: "Rostova", roleCode: "planner" },
        { email: "warehouse@maintenx.com", firstName: "Carlos", lastName: "Mendez", roleCode: "warehouse" },
        { email: "maintenance@maintenx.com", firstName: "Dave", lastName: "Miller", roleCode: "maintenance" },
        { email: "supervisor@maintenx.com", firstName: "Sarah", lastName: "Jenkins", roleCode: "supervisor" },
        { email: "linelead@maintenx.com", firstName: "Devang", lastName: "Patel", roleCode: "line_lead" },
        { email: "operator@maintenx.com", firstName: "Marcus", lastName: "Chen", roleCode: "operator" },
        { email: "qa@maintenx.com", firstName: "Dr. Rachel", lastName: "Thorne", roleCode: "quality" },
        { email: "quality@maintenx.com", firstName: "Dr. Rachel", lastName: "Thorne", roleCode: "quality" },
        { email: "ci@maintenx.com", firstName: "Viktor", lastName: "Hayes", roleCode: "ci_engineer" },
        { email: "executive@maintenx.com", firstName: "Victoria", lastName: "Sterling", roleCode: "executive" },
        { email: "master@maintenx.com", firstName: "Elena", lastName: "Vance", roleCode: "master_admin", isMasterAdmin: true },
    ];
    for (const u of userDefinitions) {
        let [existingUser] = await database_js_1.db.select().from(index_js_1.users).where((0, drizzle_orm_1.eq)(index_js_1.users.email, u.email.toLowerCase())).limit(1);
        if (!existingUser) {
            [existingUser] = await database_js_1.db
                .insert(index_js_1.users)
                .values({
                tenantId: demoTenant.id,
                email: u.email.toLowerCase(),
                passwordHash,
                firstName: u.firstName,
                lastName: u.lastName,
                digitalSignaturePinHash: pinHash,
                isMasterAdmin: u.isMasterAdmin || false,
                status: "ACTIVE",
            })
                .returning();
            console.log(`Created user: ${u.email}`);
        }
        else {
            await database_js_1.db.update(index_js_1.users).set({ passwordHash, status: "ACTIVE" }).where((0, drizzle_orm_1.eq)(index_js_1.users.id, existingUser.id));
            console.log(`Updated user password for: ${u.email}`);
        }
        // Map role
        const roleObj = seededRoles[u.roleCode];
        if (roleObj) {
            const [existingUserRole] = await database_js_1.db.select().from(index_js_1.userRoles).where((0, drizzle_orm_1.eq)(index_js_1.userRoles.userId, existingUser.id)).limit(1);
            if (!existingUserRole) {
                await database_js_1.db.insert(index_js_1.userRoles).values({
                    userId: existingUser.id,
                    roleId: roleObj.id,
                    plantId: indorePlant.id,
                });
                console.log(`Assigned role ${u.roleCode} to user ${u.email}`);
            }
            else {
                await database_js_1.db.update(index_js_1.userRoles).set({ roleId: roleObj.id, plantId: indorePlant.id }).where((0, drizzle_orm_1.eq)(index_js_1.userRoles.userId, existingUser.id));
                console.log(`Updated role ${u.roleCode} for user ${u.email}`);
            }
        }
    }
    console.log("All roles and users seeded successfully!");
    process.exit(0);
}
main().catch(err => {
    console.error("Error in seeding:", err);
    process.exit(1);
});
//# sourceMappingURL=seed_users_and_roles.js.map