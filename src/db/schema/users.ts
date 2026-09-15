import { pgTable, uuid, varchar, text, timestamp, boolean, primaryKey } from "drizzle-orm/pg-core";
import { tenants, plants } from "./tenants";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  avatarUrl: text("avatar_url"),
  digitalSignaturePinHash: varchar("digital_signature_pin_hash", { length: 255 }),
  isMasterAdmin: boolean("is_master_admin").default(false).notNull(),
  status: varchar("status", { length: 50 }).default("ACTIVE").notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }), // null if system role
  code: varchar("code", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isSystem: boolean("is_system").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 150 }).notNull().unique(), // e.g. "production.approve"
  module: varchar("module", { length: 100 }).notNull(),     // e.g. "production"
  action: varchar("action", { length: 100 }).notNull(),     // e.g. "approve"
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id").references(() => roles.id, { onDelete: "cascade" }).notNull(),
    permissionId: uuid("permission_id").references(() => permissions.id, { onDelete: "cascade" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.roleId, table.permissionId] }),
  ]
);

export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }).notNull(),
    roleId: uuid("roleId").references(() => roles.id, { onDelete: "cascade" }).notNull(),
    plantId: uuid("plantId").references(() => plants.id, { onDelete: "cascade" }), // optional plant scope
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.roleId] }),
  ]
);

export const userInvitations = pgTable("user_invitations", {
  id: varchar("id", { length: 50 }).primaryKey(), // e.g. "INV-101"
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull().default("Quality Analyst"),
  department: varchar("department", { length: 255 }).default("Quality"),
  invitedBy: varchar("invited_by", { length: 255 }).default("Alexander Vance"),
  sentDate: varchar("sent_date", { length: 20 }).notNull(), // ISO date string YYYY-MM-DD
  status: varchar("status", { length: 50 }).default("Pending").notNull(), // "Pending" | "Accepted" | "Revoked"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const approvalRules = pgTable("approval_rules", {
  id: varchar("id", { length: 50 }).primaryKey(), // e.g. "APR-01"
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  event: varchar("event", { length: 255 }).notNull(),
  tier: varchar("tier", { length: 100 }).notNull(),
  authorizedRoles: varchar("authorized_roles", { length: 255 }).notNull(),
  compliance: varchar("compliance", { length: 150 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
