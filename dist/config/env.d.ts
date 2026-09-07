import { z } from "zod";
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    HOST: z.ZodDefault<z.ZodString>;
    DATABASE_URL: z.ZodDefault<z.ZodString>;
    JWT_SECRET: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_SECRET: z.ZodDefault<z.ZodString>;
    JWT_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    CORS_ORIGIN: z.ZodDefault<z.ZodString>;
    RATE_LIMIT_MAX: z.ZodDefault<z.ZodNumber>;
    RATE_LIMIT_WINDOW_MS: z.ZodDefault<z.ZodNumber>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<["fatal", "error", "warn", "info", "debug", "trace"]>>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    HOST: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
    CORS_ORIGIN: string;
    RATE_LIMIT_MAX: number;
    RATE_LIMIT_WINDOW_MS: number;
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
}, {
    NODE_ENV?: "development" | "production" | "test" | undefined;
    PORT?: number | undefined;
    HOST?: string | undefined;
    DATABASE_URL?: string | undefined;
    JWT_SECRET?: string | undefined;
    JWT_REFRESH_SECRET?: string | undefined;
    JWT_EXPIRES_IN?: string | undefined;
    JWT_REFRESH_EXPIRES_IN?: string | undefined;
    CORS_ORIGIN?: string | undefined;
    RATE_LIMIT_MAX?: number | undefined;
    RATE_LIMIT_WINDOW_MS?: number | undefined;
    LOG_LEVEL?: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | undefined;
}>;
export type Env = z.infer<typeof envSchema>;
export declare const env: {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    HOST: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
    CORS_ORIGIN: string;
    RATE_LIMIT_MAX: number;
    RATE_LIMIT_WINDOW_MS: number;
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
};
export {};
//# sourceMappingURL=env.d.ts.map