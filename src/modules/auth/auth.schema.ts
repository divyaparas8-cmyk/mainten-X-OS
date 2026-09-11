import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid work email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  plantId: z.string().uuid().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  tenantName: z.string().min(2, "Company name is required"),
  tenantSlug: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string().default("admin"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const digitalSignOffSchema = z.object({
  pin: z.string().min(4, "4-digit signature PIN required"),
  entityType: z.string().default("General"),
  entityId: z.string().default("system"),
  meaning: z.string().default("DIGITAL_SIGN_OFF"),
  comments: z.string().optional(),
});

export type DigitalSignOffInput = z.infer<typeof digitalSignOffSchema>;
