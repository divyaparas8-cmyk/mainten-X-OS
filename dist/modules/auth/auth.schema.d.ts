import { z } from "zod";
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    plantId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    plantId?: string | undefined;
}, {
    email: string;
    password: string;
    plantId?: string | undefined;
}>;
export type LoginInput = z.infer<typeof loginSchema>;
export declare const registerSchema: z.ZodObject<{
    tenantName: z.ZodString;
    tenantSlug: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    tenantName: string;
    tenantSlug: string;
    role: string;
}, {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    tenantName: string;
    tenantSlug: string;
    role?: string | undefined;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export declare const digitalSignOffSchema: z.ZodObject<{
    pin: z.ZodString;
    entityType: z.ZodString;
    entityId: z.ZodString;
    meaning: z.ZodString;
    comments: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    entityType: string;
    entityId: string;
    meaning: string;
    pin: string;
    comments?: string | undefined;
}, {
    entityType: string;
    entityId: string;
    meaning: string;
    pin: string;
    comments?: string | undefined;
}>;
export type DigitalSignOffInput = z.infer<typeof digitalSignOffSchema>;
//# sourceMappingURL=auth.schema.d.ts.map