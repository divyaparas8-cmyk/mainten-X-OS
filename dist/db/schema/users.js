"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvalRules = exports.userInvitations = exports.userRoles = exports.rolePermissions = exports.permissions = exports.roles = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    passwordHash: (0, pg_core_1.varchar)("password_hash", { length: 255 }).notNull(),
    firstName: (0, pg_core_1.varchar)("first_name", { length: 100 }).notNull(),
    lastName: (0, pg_core_1.varchar)("last_name", { length: 100 }).notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 50 }),
    avatarUrl: (0, pg_core_1.text)("avatar_url"),
    digitalSignaturePinHash: (0, pg_core_1.varchar)("digital_signature_pin_hash", { length: 255 }),
    isMasterAdmin: (0, pg_core_1.boolean)("is_master_admin").default(false).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("ACTIVE").notNull(),
    lastLoginAt: (0, pg_core_1.timestamp)("last_login_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.roles = (0, pg_core_1.pgTable)("roles", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }), // null if system role
    code: (0, pg_core_1.varchar)("code", { length: 100 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    isSystem: (0, pg_core_1.boolean)("is_system").default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.permissions = (0, pg_core_1.pgTable)("permissions", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    code: (0, pg_core_1.varchar)("code", { length: 150 }).notNull().unique(), // e.g. "production.approve"
    module: (0, pg_core_1.varchar)("module", { length: 100 }).notNull(), // e.g. "production"
    action: (0, pg_core_1.varchar)("action", { length: 100 }).notNull(), // e.g. "approve"
    description: (0, pg_core_1.text)("description"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.rolePermissions = (0, pg_core_1.pgTable)("role_permissions", {
    roleId: (0, pg_core_1.uuid)("role_id").references(() => exports.roles.id, { onDelete: "cascade" }).notNull(),
    permissionId: (0, pg_core_1.uuid)("permission_id").references(() => exports.permissions.id, { onDelete: "cascade" }).notNull(),
}, (table) => [
    (0, pg_core_1.primaryKey)({ columns: [table.roleId, table.permissionId] }),
]);
exports.userRoles = (0, pg_core_1.pgTable)("user_roles", {
    userId: (0, pg_core_1.uuid)("userId").references(() => exports.users.id, { onDelete: "cascade" }).notNull(),
    roleId: (0, pg_core_1.uuid)("roleId").references(() => exports.roles.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plantId").references(() => tenants_1.plants.id, { onDelete: "cascade" }), // optional plant scope
}, (table) => [
    (0, pg_core_1.primaryKey)({ columns: [table.userId, table.roleId] }),
]);
exports.userInvitations = (0, pg_core_1.pgTable)("user_invitations", {
    id: (0, pg_core_1.varchar)("id", { length: 50 }).primaryKey(), // e.g. "INV-101"
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull(),
    role: (0, pg_core_1.varchar)("role", { length: 255 }).notNull().default("Quality Analyst"),
    department: (0, pg_core_1.varchar)("department", { length: 255 }).default("Quality"),
    invitedBy: (0, pg_core_1.varchar)("invited_by", { length: 255 }).default("Alexander Vance"),
    sentDate: (0, pg_core_1.varchar)("sent_date", { length: 20 }).notNull(), // ISO date string YYYY-MM-DD
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Pending").notNull(), // "Pending" | "Accepted" | "Revoked"
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.approvalRules = (0, pg_core_1.pgTable)("approval_rules", {
    id: (0, pg_core_1.varchar)("id", { length: 50 }).primaryKey(), // e.g. "APR-01"
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }),
    event: (0, pg_core_1.varchar)("event", { length: 255 }).notNull(),
    tier: (0, pg_core_1.varchar)("tier", { length: 100 }).notNull(),
    authorizedRoles: (0, pg_core_1.varchar)("authorized_roles", { length: 255 }).notNull(),
    compliance: (0, pg_core_1.varchar)("compliance", { length: 150 }),
    description: (0, pg_core_1.text)("description"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
