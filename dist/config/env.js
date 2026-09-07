"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    HOST: zod_1.z.string().default("0.0.0.0"),
    DATABASE_URL: zod_1.z.string().default("postgresql://postgres:postgres@localhost:5432/maintenx_os"),
    JWT_SECRET: zod_1.z.string().min(16).default("super-secure-maintenx-os-jwt-secret-key-2026-manufacturing-cloud"),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16).default("super-secure-maintenx-os-refresh-secret-key-2026-token"),
    JWT_EXPIRES_IN: zod_1.z.string().default("1d"),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default("7d"),
    CORS_ORIGIN: zod_1.z.string().default("http://localhost:5173,http://localhost:3000"),
    RATE_LIMIT_MAX: zod_1.z.coerce.number().default(1000),
    RATE_LIMIT_WINDOW_MS: zod_1.z.coerce.number().default(60000),
    LOG_LEVEL: zod_1.z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error("❌ Invalid environment variables:", JSON.stringify(parsedEnv.error.format(), null, 2));
    process.exit(1);
}
exports.env = parsedEnv.data;
//# sourceMappingURL=env.js.map