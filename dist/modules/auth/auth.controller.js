"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_js_1 = require("./auth.service.js");
const auth_schema_js_1 = require("./auth.schema.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
const AppError_js_1 = require("../../shared/errors/AppError.js");
const auditContext_js_1 = require("../../middleware/auditContext.js");
const master_service_js_1 = require("../master/master.service.js");
class AuthController {
    async register(request, reply) {
        const body = (request.body || {});
        const name = (body.name || body.company || body.companyName || "").trim();
        const admin = (body.admin || body.adminName || body.ownerName || body.fullName || "").trim();
        const adminEmail = (body.adminEmail || body.email || "").trim().toLowerCase();
        const adminPhone = (body.adminPhone || body.phone || "").trim();
        const password = (body.password || "").trim();
        const subscription = (body.subscription || body.plan || "Plant Pilot").trim();
        if (!name || !admin || !adminEmail || !password) {
            throw new AppError_js_1.ValidationError("Company name, company owner name, email, and password are required");
        }
        if (password.length < 6) {
            throw new AppError_js_1.ValidationError("Password must be at least 6 characters");
        }
        const company = await master_service_js_1.masterAdminService.createCompany({
            name,
            admin,
            adminEmail,
            adminPhone,
            password,
            subscription,
        });
        const { user, tenant } = await auth_service_js_1.authService.validateUserCredentials({
            email: adminEmail,
            password,
        });
        const token = await reply.jwtSign({
            userId: user.id,
            email: user.email,
            tenantId: user.tenantId,
            plantId: user.plantId,
            role: user.role,
            permissions: ["*"],
            isMasterAdmin: user.isMasterAdmin,
        });
        await (0, auditContext_js_1.logAuditTrail)({
            tenantId: user.tenantId,
            plantId: user.plantId,
            userId: user.id,
            action: "REGISTER",
            entityType: "Tenant",
            entityId: user.tenantId,
            ipAddress: request.ip,
            userAgent: request.headers["user-agent"],
        });
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)({
            token,
            user,
            tenant: tenant ? { id: tenant.id, name: tenant.name, slug: tenant.slug } : null,
            company,
        }, "Tenant registered successfully"));
    }
    async login(request, reply) {
        const input = auth_schema_js_1.loginSchema.parse(request.body);
        const { user, tenant } = await auth_service_js_1.authService.validateUserCredentials(input);
        const token = await reply.jwtSign({
            userId: user.id,
            email: user.email,
            tenantId: user.tenantId,
            plantId: user.plantId,
            role: user.role,
            permissions: ["*"],
            isMasterAdmin: user.isMasterAdmin,
        });
        await (0, auditContext_js_1.logAuditTrail)({
            tenantId: user.tenantId,
            plantId: user.plantId,
            userId: user.id,
            action: "LOGIN",
            entityType: "UserSession",
            entityId: user.id,
            ipAddress: request.ip,
            userAgent: request.headers["user-agent"],
        });
        return reply.send((0, responseFormatter_js_1.formatSuccess)({
            token,
            user,
            tenant: tenant ? { id: tenant.id, name: tenant.name, slug: tenant.slug } : null,
        }, "Logged in successfully"));
    }
    async me(request, reply) {
        return reply.send((0, responseFormatter_js_1.formatSuccess)({
            user: request.user,
        }));
    }
    async digitalSignOff(request, reply) {
        const input = auth_schema_js_1.digitalSignOffSchema.parse(request.body);
        const user = request.user;
        const isValid = await auth_service_js_1.authService.verifyDigitalSignaturePin(user.userId, input.pin);
        if (!isValid) {
            throw new AppError_js_1.UnauthorizedError("Invalid 21 CFR Part 11 Digital Signature PIN");
        }
        await (0, auditContext_js_1.logAuditTrail)({
            tenantId: user.tenantId,
            plantId: user.plantId,
            userId: user.userId,
            action: "DIGITAL_SIGNATURE",
            entityType: input.entityType,
            entityId: input.entityId,
            newValues: { meaning: input.meaning, comments: input.comments },
            ipAddress: request.ip,
        });
        return reply.send((0, responseFormatter_js_1.formatSuccess)({
            signed: true,
            signedAt: new Date().toISOString(),
            signedBy: user.email,
        }, "Electronic signature verified and recorded (21 CFR Part 11)"));
    }
    async logout(request, reply) {
        return reply.send((0, responseFormatter_js_1.formatSuccess)(null, "Logged out cleanly"));
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map