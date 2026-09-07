import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/maintenx_os"),
  JWT_SECRET: z.string().min(16).default("super-secure-maintenx-os-jwt-secret-key-2026-manufacturing-cloud"),
  JWT_REFRESH_SECRET: z.string().min(16).default("super-secure-maintenx-os-refresh-secret-key-2026-token"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:5173,http://localhost:3000"),
  RATE_LIMIT_MAX: z.coerce.number().default(1000),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});

export type Env = z.infer<typeof envSchema>;

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

export const env = parsedEnv.data;
