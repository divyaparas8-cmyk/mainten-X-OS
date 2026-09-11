"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.digitalSignOffSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Please provide a valid work email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    plantId: zod_1.z.string().uuid().optional(),
});
exports.registerSchema = zod_1.z.object({
    tenantName: zod_1.z.string().min(2, "Company name is required"),
    tenantSlug: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    role: zod_1.z.string().default("admin"),
});
exports.digitalSignOffSchema = zod_1.z.object({
    pin: zod_1.z.string().min(4, "4-digit signature PIN required"),
    entityType: zod_1.z.string().default("General"),
    entityId: zod_1.z.string().default("system"),
    meaning: zod_1.z.string().default("DIGITAL_SIGN_OFF"),
    comments: zod_1.z.string().optional(),
});
//# sourceMappingURL=auth.schema.js.map