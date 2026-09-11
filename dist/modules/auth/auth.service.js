"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_js_1 = require("../../config/database.js");
const index_js_1 = require("../../db/schema/index.js");
const drizzle_orm_1 = require("drizzle-orm");
const AppError_js_1 = require("../../shared/errors/AppError.js");
class AuthService {
    async validateUserCredentials(input) {
        const [user] = await database_js_1.db.select().from(index_js_1.users).where((0, drizzle_orm_1.eq)(index_js_1.users.email, input.email.toLowerCase())).limit(1);
        if (!user) {
            throw new AppError_js_1.UnauthorizedError("Invalid email or password");
        }
        if (user.status !== "ACTIVE") {
            throw new AppError_js_1.UnauthorizedError("Your account has been deactivated. Please contact your system administrator.");
        }
        const isValidPassword = await bcryptjs_1.default.compare(input.password, user.passwordHash);
        if (!isValidPassword) {
            throw new AppError_js_1.UnauthorizedError("Invalid email or password");
        }
        // Get user's active tenant
        const [tenant] = await database_js_1.db.select().from(index_js_1.tenants).where((0, drizzle_orm_1.eq)(index_js_1.tenants.id, user.tenantId)).limit(1);
        // Get user's roles
        const userRoleRecords = await database_js_1.db.select().from(index_js_1.userRoles).where((0, drizzle_orm_1.eq)(index_js_1.userRoles.userId, user.id));
        let primaryRole = "operator";
        if (userRoleRecords.length > 0) {
            const [roleRecord] = await database_js_1.db.select().from(index_js_1.roles).where((0, drizzle_orm_1.eq)(index_js_1.roles.id, userRoleRecords[0].roleId)).limit(1);
            if (roleRecord)
                primaryRole = roleRecord.code;
        }
        if (user.isMasterAdmin) {
            primaryRole = "master_admin";
        }
        // Get default plant
        const [defaultPlant] = await database_js_1.db.select().from(index_js_1.plants).where((0, drizzle_orm_1.eq)(index_js_1.plants.tenantId, user.tenantId)).limit(1);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                tenantId: user.tenantId,
                plantId: input.plantId || defaultPlant?.id,
                role: primaryRole,
                isMasterAdmin: user.isMasterAdmin,
                avatarUrl: user.avatarUrl,
            },
            tenant,
        };
    }
    async verifyDigitalSignaturePin(userId, pin) {
        const [user] = await database_js_1.db.select().from(index_js_1.users).where((0, drizzle_orm_1.eq)(index_js_1.users.id, userId)).limit(1);
        if (!user || !user.digitalSignaturePinHash)
            return false;
        return await bcryptjs_1.default.compare(pin, user.digitalSignaturePinHash);
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map