import bcrypt from "bcryptjs";
import { eq, desc, asc, sql, and, or, ilike, inArray } from "drizzle-orm";
import { db, pool } from "../../config/database.js";
import {
  tenants,
  plants,
  users,
  roles,
  userRoles,
  auditLogs,
  subscriptions,
  payments,
  plans,
  supportTickets,
  platformSettings,
  tenantModules,
} from "../../db/schema/index.js";
import { NotFoundError, ValidationError, ForbiddenError } from "../../shared/errors/AppError.js";

export interface ActorContext {
  userId?: string;
  email?: string;
  role?: string;
  ipAddress?: string;
  userAgent?: string;
}

export class MasterAdminService {
  // Helper to append audit records within transactions or standalone
  private async writeAudit(params: {
    actor?: ActorContext;
    action: string;
    entityType: string;
    entityId: string;
    tenantId?: string | null;
    oldValues?: any;
    newValues?: any;
  }) {
    try {
      await db.insert(auditLogs).values({
        tenantId: params.tenantId as any,
        userId: params.actor?.userId as any,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        oldValues: params.oldValues || null,
        newValues: params.newValues || null,
        ipAddress: params.actor?.ipAddress || null,
        userAgent: params.actor?.userAgent || null,
      });
    } catch (e) {
      console.error("⚠️ Master Admin audit log failed:", (e as Error).message);
    }
  }

  // =========================================================================
  // 1. DASHBOARD & CONTROL CENTER
  // =========================================================================
  async getDashboard() {
    // 1. Total, Active, Suspended Companies
    const allTenants = await db.select().from(tenants);
    const totalCompanies = allTenants.length;
    const activeCompanies = allTenants.filter((t) => t.status.toUpperCase() === "ACTIVE").length;
    const suspendedCompanies = allTenants.filter((t) => t.status.toUpperCase() === "SUSPENDED").length;

    // 2. Global Users & Company Admins
    const allUsers = await db.select().from(users);
    const totalUsers = allUsers.length;

    // Company Admins: count users with role 'admin'
    const adminRoles = await db.select().from(roles).where(eq(roles.code, "admin"));
    let totalAdmins = 0;
    if (adminRoles.length > 0) {
      const adminRoleIds = adminRoles.map((r) => r.id);
      const adminUserRoles = await db
        .select()
        .from(userRoles)
        .where(inArray(userRoles.roleId, adminRoleIds));
      totalAdmins = new Set(adminUserRoles.map((ur) => ur.userId)).size;
    }

    // 3. Subscriptions Metrics
    const allSubs = await db.select().from(subscriptions);
    const activeSubscriptions = allSubs.filter((s) => s.status.toUpperCase() === "ACTIVE").length;

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const now = new Date();

    const expiringSubscriptions = allSubs.filter((s) => {
      const end = new Date(s.currentPeriodEnd);
      return s.status.toUpperCase() === "ACTIVE" && end > now && end <= thirtyDaysFromNow;
    }).length;

    // 4. Pending Support Tickets
    const pendingTicketsResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(supportTickets)
      .where(or(eq(supportTickets.status, "Open"), eq(supportTickets.status, "In Progress")));
    const pendingTickets = pendingTicketsResult[0]?.count || 0;

    // 5. System Alerts (calculated from recent failed payments + open high-priority tickets)
    const highPriorityTickets = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(supportTickets)
      .where(and(eq(supportTickets.priority, "High"), or(eq(supportTickets.status, "Open"), eq(supportTickets.status, "In Progress"))));
    
    const recentFailedPayments = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(payments)
      .where(eq(payments.status, "FAILED"));

    const systemAlerts = (highPriorityTickets[0]?.count || 0) + (recentFailedPayments[0]?.count || 0);

    // 6. Plan breakdown distribution
    const planBreakdown: Record<string, number> = {};
    for (const t of allTenants) {
      const pName = t.plan || "Enterprise";
      planBreakdown[pName] = (planBreakdown[pName] || 0) + 1;
    }

    // 7. Recent Platform Activity (from PostgreSQL audit_logs)
    const recentAudit = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        entityType: auditLogs.entityType,
        entityId: auditLogs.entityId,
        createdAt: auditLogs.createdAt,
        ipAddress: auditLogs.ipAddress,
        userId: auditLogs.userId,
        tenantId: auditLogs.tenantId,
      })
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(10);

    // Enrich audit logs with actor emails if available
    const userMap = new Map(allUsers.map((u) => [u.id, `${u.firstName} ${u.lastName}`]));
    const tenantMap = new Map(allTenants.map((t) => [t.id, t.name]));

    const activityLogs = recentAudit.map((log) => {
      const actorName = log.userId ? userMap.get(log.userId) || "Master Admin" : "System / Master Admin";
      const targetTenant = log.tenantId ? tenantMap.get(log.tenantId) : undefined;
      return {
        id: log.id,
        action: log.action,
        details: `${actorName} performed ${log.action} on ${log.entityType} (${log.entityId})${
          targetTenant ? ` for ${targetTenant}` : ""
        }`,
        date: log.createdAt.toISOString().replace("T", " ").substring(0, 19),
        actor: actorName,
        ip: log.ipAddress || "N/A",
      };
    });

    return {
      kpis: {
        totalCompanies,
        activeCompanies,
        suspendedCompanies,
        totalUsers,
        totalAdmins,
        activeSubscriptions,
        expiringSubscriptions,
        pendingTickets,
        systemAlerts,
        companyGrowth: "+2 this month",
        userGrowth: "+12% growth",
      },
      planBreakdown,
      activityLogs,
    };
  }

  // =========================================================================
  // 2. COMPANIES MANAGEMENT
  // =========================================================================
  async getCompanies(query?: { search?: string; status?: string }) {
    const allTenants = await db.select().from(tenants).orderBy(desc(tenants.createdAt));
    const allPlants = await db.select().from(plants);
    const allUsers = await db.select().from(users);
    const allSubs = await db.select().from(subscriptions);
    const allModules = await db.select().from(tenantModules);

    // Grouping by tenant
    const plantCounts = new Map<string, number>();
    for (const p of allPlants) {
      plantCounts.set(p.tenantId, (plantCounts.get(p.tenantId) || 0) + 1);
    }

    const userCounts = new Map<string, number>();
    const tenantAdmins = new Map<string, { name: string; email: string; lastLogin?: string }>();
    for (const u of allUsers) {
      userCounts.set(u.tenantId, (userCounts.get(u.tenantId) || 0) + 1);
      // Pick first user or admin as primary contact
      if (!tenantAdmins.has(u.tenantId)) {
        tenantAdmins.set(u.tenantId, {
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          phone: u.phone || "",
          lastLogin: u.lastLoginAt ? u.lastLoginAt.toISOString().replace("T", " ").substring(0, 16) : "Never",
        });
      }
    }

    // Subscriptions map (latest active)
    const tenantSubs = new Map<string, any>();
    for (const s of allSubs) {
      if (!tenantSubs.has(s.tenantId) || s.status.toUpperCase() === "ACTIVE") {
        tenantSubs.set(s.tenantId, s);
      }
    }

    // Modules map
    const tenantModuleMaps = new Map<string, Record<string, boolean>>();
    for (const m of allModules) {
      if (!tenantModuleMaps.has(m.tenantId)) {
        tenantModuleMaps.set(m.tenantId, {});
      }
      tenantModuleMaps.get(m.tenantId)![m.moduleKey] = m.isEnabled;
    }

    const defaultModules = {
      plan: true,
      produce: true,
      verify: true,
      maintain: true,
      move: true,
      people: true,
      improve: true,
      intelligence: true,
    };

    let result = allTenants.map((t) => {
      const sub = tenantSubs.get(t.id);
      const admin = tenantAdmins.get(t.id) || { name: "System Administrator", email: `admin@${t.slug}.com`, phone: "", lastLogin: "Never" };
      const expiry = sub ? new Date(sub.currentPeriodEnd).toISOString().split("T")[0] : "2027-01-01";
      const subName = sub ? sub.planName : t.plan || "MaintenX OS Complete";

      return {
        id: t.id,
        name: t.name,
        slug: t.slug,
        status: t.status.charAt(0).toUpperCase() + t.status.slice(1).toLowerCase(),
        subscription: subName,
        admin: admin.name,
        adminEmail: admin.email,
        adminPhone: (admin as any).phone || "",
        usersCount: userCounts.get(t.id) || 1,
        plants: plantCounts.get(t.id) || 1,
        createdAt: t.createdAt.toISOString().split("T")[0],
        expiryDate: expiry,
        lastActivity: admin.lastLogin || t.updatedAt.toISOString().replace("T", " ").substring(0, 16),
        currency: (t.settings as any)?.currency || "CAD",
        modules: tenantModuleMaps.get(t.id) || defaultModules,
      };
    });

    // Apply search filter
    if (query?.search) {
      const s = query.search.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(s) || c.admin.toLowerCase().includes(s) || c.adminEmail.toLowerCase().includes(s)
      );
    }

    // Apply status filter
    if (query?.status && query.status !== "All") {
      if (query.status === "Expired") {
        const today = new Date().toISOString().split("T")[0];
        result = result.filter((c) => c.expiryDate < today);
      } else {
        result = result.filter(
          (c) => c.status.toLowerCase() === query.status!.toLowerCase() || c.subscription.toLowerCase() === query.status!.toLowerCase()
        );
      }
    }

    // Exclude DEACTIVATED tenants from default listing unless explicitly queried
    if (query?.status?.toLowerCase() !== "deactivated") {
      result = result.filter((c) => c.status.toLowerCase() !== "deactivated");
    }

    return result;
  }

  async getCompanyById(id: string) {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);
    if (!tenant) {
      throw new NotFoundError(`Company with ID '${id}' not found`);
    }

    // 1. Plants
    const companyPlants = await db.select().from(plants).where(eq(plants.tenantId, id));

    // 2. Users & Admins
    const companyUsers = await db.select().from(users).where(eq(users.tenantId, id));
    const adminRoles = await db.select().from(roles).where(eq(roles.code, "admin"));
    const adminRoleIds = new Set(adminRoles.map((r) => r.id));

    // 3. Subscriptions
    const companySubs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.tenantId, id))
      .orderBy(desc(subscriptions.createdAt));

    // 4. Modules
    const compModules = await db.select().from(tenantModules).where(eq(tenantModules.tenantId, id));
    const modulesMap: Record<string, boolean> = {
      plan: true,
      produce: true,
      verify: true,
      maintain: true,
      move: true,
      people: true,
      improve: true,
      intelligence: true,
    };
    for (const m of compModules) {
      modulesMap[m.moduleKey] = m.isEnabled;
    }

    // 5. Recent Activity for this company
    const companyAudit = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.tenantId, id))
      .orderBy(desc(auditLogs.createdAt))
      .limit(10);

    const activeSub = companySubs[0];
    const primaryAdmin = companyUsers[0];

    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      status: tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1).toLowerCase(),
      subscription: activeSub?.planName || tenant.plan || "MaintenX OS Complete",
      admin: primaryAdmin ? `${primaryAdmin.firstName} ${primaryAdmin.lastName}` : "System Admin",
      adminEmail: primaryAdmin ? primaryAdmin.email : `admin@${tenant.slug}.com`,
      usersCount: companyUsers.length,
      plants: companyPlants.length,
      createdAt: tenant.createdAt.toISOString().split("T")[0],
      expiryDate: activeSub ? new Date(activeSub.currentPeriodEnd).toISOString().split("T")[0] : "2027-01-01",
      lastActivity: primaryAdmin?.lastLoginAt?.toISOString().replace("T", " ").substring(0, 16) || "N/A",
      currency: (tenant.settings as any)?.currency || "CAD",
      modules: modulesMap,
      plantsList: companyPlants.map((p) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        location: `${p.city}, ${p.state || ""}, ${p.country || ""}`,
        lines: 3,
        capacity: "250,000 Units/Day",
        status: p.isActive ? "Operational" : "Maintenance",
      })),
      usersList: companyUsers.map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        status: u.status.charAt(0).toUpperCase() + u.status.slice(1).toLowerCase(),
        lastLogin: u.lastLoginAt?.toISOString().replace("T", " ").substring(0, 16) || "Never",
      })),
      subscriptionsList: companySubs,
      activityList: companyAudit.map((a) => ({
        id: a.id,
        action: a.action,
        date: a.createdAt.toISOString().replace("T", " ").substring(0, 19),
        details: `${a.action} on ${a.entityType}`,
      })),
      settings: tenant.settings || {},
    };
  }

  async createCompany(
    input: {
      name: string;
      admin: string;
      adminEmail: string;
      adminPhone?: string;
      subscription?: string;
      plantsCount?: number;
      currency?: string;
    },
    actor?: ActorContext
  ) {
    if (!input.name || !input.admin || !input.adminEmail) {
      throw new ValidationError("Company name, administrator name, and email are required");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 50) + `-${Date.now().toString(36)}`;

      // 1. Create Tenant
      const planName = input.subscription || "MaintenX OS Complete";
      const { rows: tenantRows } = await client.query(
        `INSERT INTO tenants (name, slug, plan, status, settings)
         VALUES ($1, $2, $3, 'ACTIVE', $4)
         RETURNING *`,
        [input.name, slug, planName, JSON.stringify({ currency: input.currency || "CAD" })]
      );
      const newTenant = tenantRows[0];

      // 2. Create Default Plant
      const plantCode = `${input.name.replace(/[^a-zA-Z]/g, "").substring(0, 4).toUpperCase() || "PLT"}-01`;
      await client.query(
        `INSERT INTO plants (tenant_id, code, name, city, state, country)
         VALUES ($1, $2, $3, 'Primary Facility', 'HQ', 'India')`,
        [newTenant.id, plantCode, `${input.name} Main Site`]
      );

      // 3. Create Admin User
      const [firstName, ...lastNames] = input.admin.trim().split(" ");
      const lastName = lastNames.join(" ") || "Admin";
      const defaultPasswordHash = await bcrypt.hash("Password@123", 10);
      const defaultPinHash = await bcrypt.hash("1234", 10);

      const { rows: userRows } = await client.query(
        `INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, phone, digital_signature_pin_hash, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVE')
         RETURNING *`,
        [newTenant.id, input.adminEmail.toLowerCase().trim(), defaultPasswordHash, firstName, lastName, input.adminPhone || null, defaultPinHash]
      );
      const newUser = userRows[0];

      // 4. Assign Admin Role
      const { rows: roleRows } = await client.query(`SELECT id FROM roles WHERE code = 'admin' LIMIT 1`);
      if (roleRows.length > 0) {
        await client.query(
          `INSERT INTO user_roles ("userId", "roleId") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [newUser.id, roleRows[0].id]
        );
      }

      // 5. Seed Default Module Entitlements
      const coreModules = ["plan", "produce", "verify", "maintain", "move", "people", "improve", "intelligence"];
      for (const mod of coreModules) {
        await client.query(
          `INSERT INTO tenant_modules (tenant_id, module_key, is_enabled)
           VALUES ($1, $2, true)
           ON CONFLICT DO NOTHING`,
          [newTenant.id, mod]
        );
      }

      // 6. Create Initial Subscription (1 year)
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      await client.query(
        `INSERT INTO subscriptions (tenant_id, plan_id, plan_name, status, billing_cycle, amount, currency, current_period_end)
         VALUES ($1, $2, $3, 'ACTIVE', 'ANNUAL', 34990, $4, $5)`,
        [newTenant.id, "bundles", planName, input.currency || "CAD", oneYearLater]
      );

      // 7. Commit Transaction
      await client.query("COMMIT");

      // 8. Log Audit Event
      await this.writeAudit({
        actor,
        action: "COMPANY_CREATED",
        entityType: "Tenant",
        entityId: newTenant.id,
        tenantId: newTenant.id,
        newValues: { name: input.name, slug, plan: planName, adminEmail: input.adminEmail },
      });

      return {
        id: newTenant.id,
        name: newTenant.name,
        slug: newTenant.slug,
        status: "Active",
        subscription: planName,
        admin: input.admin,
        adminEmail: input.adminEmail,
        adminPhone: input.adminPhone || "",
        usersCount: 1,
        plants: 1,
        createdAt: newTenant.created_at.toISOString().split("T")[0],
        expiryDate: oneYearLater.toISOString().split("T")[0],
        currency: input.currency || "CAD",
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async updateCompanyStatus(id: string, newStatus: string, actor?: ActorContext) {
    const [company] = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);
    if (!company) throw new NotFoundError("Company not found");

    const normalizedStatus = newStatus.toUpperCase();
    await db
      .update(tenants)
      .set({ status: normalizedStatus, updatedAt: new Date() })
      .where(eq(tenants.id, id));

    await this.writeAudit({
      actor,
      action: "COMPANY_STATUS_UPDATED",
      entityType: "Tenant",
      entityId: id,
      tenantId: id,
      oldValues: { status: company.status },
      newValues: { status: normalizedStatus },
    });

    return { id, status: newStatus };
  }

  async updateCompanyDetails(id: string, updates: { name?: string; subscription?: string }, actor?: ActorContext) {
    const [company] = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);
    if (!company) throw new NotFoundError("Company not found");

    const patch: any = { updatedAt: new Date() };
    if (updates.name) patch.name = updates.name;
    if (updates.subscription) patch.plan = updates.subscription;

    await db.update(tenants).set(patch).where(eq(tenants.id, id));

    if (updates.subscription) {
      // Update active subscription plan name as well
      await db
        .update(subscriptions)
        .set({ planName: updates.subscription, updatedAt: new Date() })
        .where(eq(subscriptions.tenantId, id));
    }

    await this.writeAudit({
      actor,
      action: "COMPANY_UPDATED",
      entityType: "Tenant",
      entityId: id,
      tenantId: id,
      oldValues: { name: company.name, plan: company.plan },
      newValues: updates,
    });

    return { id, ...updates };
  }

  async deleteCompany(id: string, actor?: ActorContext) {
    const [company] = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);
    if (!company) throw new NotFoundError("Company not found");

    await this.writeAudit({
      actor,
      action: "COMPANY_DELETED",
      entityType: "Tenant",
      entityId: id,
      tenantId: id,
      oldValues: { name: company.name, slug: company.slug, status: company.status },
      newValues: { deleted: true },
    });

    // Delete company from PostgreSQL (cascades to plants, users, modules, subscriptions, etc.)
    await db.delete(tenants).where(eq(tenants.id, id));

    return { success: true, message: `Company '${company.name}' deleted successfully.` };
  }

  // =========================================================================
  // 3. COMPANY ADMINISTRATORS
  // =========================================================================
  async getCompanyAdmins(query?: { search?: string; companyId?: string; status?: string }) {
    const adminRoles = await db.select().from(roles).where(eq(roles.code, "admin"));
    if (adminRoles.length === 0) return [];

    const adminRoleIds = adminRoles.map((r) => r.id);
    const assignedUserRoles = await db
      .select()
      .from(userRoles)
      .where(inArray(userRoles.roleId, adminRoleIds));

    const userIds = [...new Set(assignedUserRoles.map((ur) => ur.userId))];
    if (userIds.length === 0) return [];

    const adminUsers = await db.select().from(users).where(inArray(users.id, userIds));
    const allTenants = await db.select().from(tenants);
    const tenantMap = new Map(allTenants.map((t) => [t.id, t.name]));

    let results = adminUsers.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      company: tenantMap.get(u.tenantId) || "Platform Enterprise",
      tenantId: u.tenantId,
      role: "Company Admin",
      status: u.status.toUpperCase() === "ACTIVE" ? "Active" : "Suspended",
      lastLogin: u.lastLoginAt ? u.lastLoginAt.toISOString().replace("T", " ").substring(0, 16) : "Never",
      createdAt: u.createdAt.toISOString().split("T")[0],
    }));

    if (query?.search) {
      const s = query.search.toLowerCase();
      results = results.filter((a) => a.name.toLowerCase().includes(s) || a.email.toLowerCase().includes(s) || a.company.toLowerCase().includes(s));
    }

    if (query?.status && query.status !== "All") {
      results = results.filter((a) => a.status.toLowerCase() === query.status!.toLowerCase());
    }

    return results;
  }

  async createCompanyAdmin(
    input: {
      name: string;
      email?: string;
      company?: string;
      companyId?: string;
    },
    actor?: ActorContext
  ) {
    if (!input.name) {
      throw new ValidationError("Administrator name is required");
    }

    let tenant: any = null;
    if (input.companyId) {
      const [t] = await db.select().from(tenants).where(eq(tenants.id, input.companyId)).limit(1);
      tenant = t;
    } else if (input.company) {
      const [t] = await db.select().from(tenants).where(eq(tenants.name, input.company)).limit(1);
      tenant = t;
    }
    if (!tenant) {
      const [firstTenant] = await db.select().from(tenants).limit(1);
      tenant = firstTenant;
    }
    if (!tenant) {
      throw new ValidationError("No tenant company found to associate administrator with");
    }

    const [firstName, ...lastNames] = input.name.trim().split(" ");
    const lastName = lastNames.join(" ") || "Admin";

    const email = (input.email && input.email.trim()) 
      ? input.email.toLowerCase().trim() 
      : `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z0-9]/g, "")}_${Date.now().toString(36)}@${tenant.slug}.com`;

    const defaultPasswordHash = await bcrypt.hash("Password@123", 10);
    const defaultPinHash = await bcrypt.hash("1234", 10);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { rows: userRows } = await client.query(
        `INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, digital_signature_pin_hash, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVE')
         RETURNING *`,
        [tenant.id, email, defaultPasswordHash, firstName, lastName, defaultPinHash]
      );
      const newUser = userRows[0];

      const { rows: roleRows } = await client.query(`SELECT id FROM roles WHERE code = 'admin' LIMIT 1`);
      if (roleRows.length > 0) {
        await client.query(
          `INSERT INTO user_roles ("userId", "roleId") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [newUser.id, roleRows[0].id]
        );
      }
      await client.query("COMMIT");

      await this.writeAudit({
        actor,
        action: "ADMIN_CREATED",
        entityType: "User",
        entityId: newUser.id,
        tenantId: tenant.id,
        newValues: { name: input.name, email, company: tenant.name },
      });

      return {
        id: newUser.id,
        name: `${newUser.first_name} ${newUser.last_name}`,
        email: newUser.email,
        company: tenant.name,
        tenantId: tenant.id,
        role: "Company Admin",
        status: "Active",
        lastLogin: "Never",
        createdAt: newUser.created_at.toISOString().split("T")[0],
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async updateCompanyAdmin(id: string, updates: { name?: string }, actor?: ActorContext) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) throw new NotFoundError("Admin user not found");

    const patch: any = { updatedAt: new Date() };
    if (updates.name) {
      const [firstName, ...lastNames] = updates.name.trim().split(" ");
      patch.firstName = firstName;
      patch.lastName = lastNames.join(" ") || "Admin";
    }

    await db.update(users).set(patch).where(eq(users.id, id));

    await this.writeAudit({
      actor,
      action: "ADMIN_UPDATED",
      entityType: "User",
      entityId: id,
      tenantId: user.tenantId,
      newValues: updates,
    });

    return { id, ...updates };
  }

  async updateAdminStatus(id: string, newStatus: string, actor?: ActorContext) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) throw new NotFoundError("Admin user not found");

    const normalized = newStatus.toUpperCase() === "ACTIVE" ? "ACTIVE" : "SUSPENDED";
    await db.update(users).set({ status: normalized, updatedAt: new Date() }).where(eq(users.id, id));

    await this.writeAudit({
      actor,
      action: "ADMIN_STATUS_CHANGED",
      entityType: "User",
      entityId: id,
      tenantId: user.tenantId,
      oldValues: { status: user.status },
      newValues: { status: normalized },
    });

    return { id, status: normalized === "ACTIVE" ? "Active" : "Suspended" };
  }

  async resetAdminPassword(id: string, actor?: ActorContext) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) throw new NotFoundError("Admin user not found");

    const tempPassword = `Temp@${Math.floor(100000 + Math.random() * 900000)}`;
    const newHash = await bcrypt.hash(tempPassword, 10);

    await db.update(users).set({ passwordHash: newHash, updatedAt: new Date() }).where(eq(users.id, id));

    await this.writeAudit({
      actor,
      action: "PASSWORD_RESET_TRIGGERED",
      entityType: "User",
      entityId: id,
      tenantId: user.tenantId,
    });

    return {
      success: true,
      message: `Password reset successfully for ${user.email}. Temporary credentials issued.`,
      tempPassword,
    };
  }

  // =========================================================================
  // 4. PLANS & PRICING
  // =========================================================================
  async getPlans() {
    const allPlans = await db.select().from(plans).orderBy(asc(plans.priceMonthly));
    return allPlans.map((p) => ({
      id: p.id,
      name: p.name,
      subtitle: p.subtitle,
      priceMonthly: Number(p.priceMonthly),
      priceAnnual: Number(p.priceAnnual),
      currency: p.currency,
      duration: p.duration,
      userLimit: p.userLimit,
      accessLevel: p.accessLevel,
      status: p.status,
      isPopular: p.isPopular,
      ctaText: p.ctaText,
      modules: p.modules,
      features: p.features,
    }));
  }

  async createPlan(input: any, actor?: ActorContext) {
    if (!input.name || input.priceMonthly === undefined) {
      throw new ValidationError("Plan name and monthly price are required");
    }

    const planId = input.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const [newPlan] = await db
      .insert(plans)
      .values({
        id: planId,
        name: input.name,
        subtitle: input.subtitle || "SaaS Production Plan",
        priceMonthly: String(input.priceMonthly),
        priceAnnual: String(input.priceAnnual || input.priceMonthly * 10),
        currency: input.currency || "CAD",
        duration: input.duration || "Unlimited",
        userLimit: input.userLimit || 10,
        accessLevel: input.accessLevel || "Standard",
        status: input.status || "Active",
        isPopular: input.isPopular || false,
        ctaText: input.ctaText || "Choose Plan",
        modules: input.modules || ["produce"],
        features: input.features || ["Standard Modules Access", "Platform Support"],
      })
      .returning();

    await this.writeAudit({
      actor,
      action: "PLAN_CREATED",
      entityType: "Plan",
      entityId: newPlan.id,
      newValues: input,
    });

    return newPlan;
  }

  async updatePlan(id: string, updates: any, actor?: ActorContext) {
    const [existing] = await db.select().from(plans).where(eq(plans.id, id)).limit(1);
    if (!existing) throw new NotFoundError(`Plan '${id}' not found`);

    const patch: any = { updatedAt: new Date() };
    if (updates.name) patch.name = updates.name;
    if (updates.subtitle !== undefined) patch.subtitle = updates.subtitle;
    if (updates.priceMonthly !== undefined) patch.priceMonthly = String(updates.priceMonthly);
    if (updates.priceAnnual !== undefined) patch.priceAnnual = String(updates.priceAnnual);
    if (updates.currency) patch.currency = updates.currency;
    if (updates.userLimit !== undefined) patch.userLimit = updates.userLimit;
    if (updates.status) patch.status = updates.status;
    if (updates.isPopular !== undefined) patch.isPopular = updates.isPopular;
    if (updates.modules) patch.modules = updates.modules;
    if (updates.features) patch.features = updates.features;

    const [updated] = await db.update(plans).set(patch).where(eq(plans.id, id)).returning();

    await this.writeAudit({
      actor,
      action: "PLAN_UPDATED",
      entityType: "Plan",
      entityId: id,
      oldValues: existing,
      newValues: patch,
    });

    return updated;
  }

  async updatePlanStatus(id: string, status: string, actor?: ActorContext) {
    const [existing] = await db.select().from(plans).where(eq(plans.id, id)).limit(1);
    if (!existing) throw new NotFoundError(`Plan '${id}' not found`);

    await db.update(plans).set({ status, updatedAt: new Date() }).where(eq(plans.id, id));

    await this.writeAudit({
      actor,
      action: "PLAN_STATUS_UPDATED",
      entityType: "Plan",
      entityId: id,
      oldValues: { status: existing.status },
      newValues: { status },
    });

    return { id, status };
  }

  async deletePlan(id: string, actor?: ActorContext) {
    const [existing] = await db.select().from(plans).where(eq(plans.id, id)).limit(1);
    if (!existing) throw new NotFoundError(`Plan '${id}' not found`);

    // Check if subscriptions rely on this plan
    const usedInSubs = await db.select().from(subscriptions).where(eq(subscriptions.planId, id)).limit(1);
    if (usedInSubs.length > 0) {
      // Soft-deactivate instead of breaking foreign keys
      await db.update(plans).set({ status: "Inactive", updatedAt: new Date() }).where(eq(plans.id, id));
      return { success: true, message: `Plan '${id}' has active subscriptions; marked Inactive safely.` };
    }

    await db.delete(plans).where(eq(plans.id, id));

    await this.writeAudit({
      actor,
      action: "PLAN_DELETED",
      entityType: "Plan",
      entityId: id,
      oldValues: existing,
    });

    return { success: true, message: `Plan '${id}' removed successfully.` };
  }

  // =========================================================================
  // 5. SUBSCRIPTIONS
  // =========================================================================
  async getSubscriptions(query?: { search?: string; plan?: string; status?: string }) {
    const allSubs = await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
    const allTenants = await db.select().from(tenants);
    const tenantMap = new Map(allTenants.map((t) => [t.id, t.name]));

    let results = allSubs.map((s) => ({
      id: s.id,
      tenantId: s.tenantId,
      company: tenantMap.get(s.tenantId) || "Enterprise Company",
      plan: s.planName,
      planId: s.planId,
      status: s.status,
      billingCycle: s.billingCycle,
      amount: Number(s.amount),
      currency: s.currency,
      startDate: s.currentPeriodStart.toISOString().split("T")[0],
      endDate: s.currentPeriodEnd.toISOString().split("T")[0],
      renewalDate: s.currentPeriodEnd.toISOString().split("T")[0],
      razorpaySubscriptionId: s.razorpaySubscriptionId || "N/A",
    }));

    if (query?.search) {
      const q = query.search.toLowerCase();
      results = results.filter((s) => s.company.toLowerCase().includes(q) || s.plan.toLowerCase().includes(q));
    }

    if (query?.plan && query.plan !== "All") {
      results = results.filter((s) => s.plan === query.plan);
    }

    if (query?.status && query.status !== "All") {
      results = results.filter((s) => s.status.toLowerCase() === query.status!.toLowerCase());
    }

    return results;
  }

  async extendSubscription(subscriptionIdOrCompanyId: string, actor?: ActorContext) {
    // Look up by subscription ID or tenant ID
    let [sub] = await db.select().from(subscriptions).where(eq(subscriptions.id, subscriptionIdOrCompanyId as any)).limit(1);
    if (!sub) {
      [sub] = await db.select().from(subscriptions).where(eq(subscriptions.tenantId, subscriptionIdOrCompanyId as any)).limit(1);
    }

    if (!sub) {
      throw new NotFoundError("Subscription not found");
    }

    const currentExpiry = new Date(sub.currentPeriodEnd);
    currentExpiry.setFullYear(currentExpiry.getFullYear() + 1);

    await db
      .update(subscriptions)
      .set({
        currentPeriodEnd: currentExpiry,
        status: "ACTIVE",
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, sub.id));

    await this.writeAudit({
      actor,
      action: "SUBSCRIPTION_EXTENDED",
      entityType: "Subscription",
      entityId: sub.id,
      tenantId: sub.tenantId,
      oldValues: { currentPeriodEnd: sub.currentPeriodEnd },
      newValues: { currentPeriodEnd: currentExpiry },
    });

    return { id: sub.id, currentPeriodEnd: currentExpiry.toISOString().split("T")[0] };
  }

  async cancelSubscription(subscriptionIdOrCompanyId: string, actor?: ActorContext) {
    let [sub] = await db.select().from(subscriptions).where(eq(subscriptions.id, subscriptionIdOrCompanyId as any)).limit(1);
    if (!sub) {
      [sub] = await db.select().from(subscriptions).where(eq(subscriptions.tenantId, subscriptionIdOrCompanyId as any)).limit(1);
    }

    if (!sub) throw new NotFoundError("Subscription not found");

    await db
      .update(subscriptions)
      .set({ status: "CANCELLED", updatedAt: new Date() })
      .where(eq(subscriptions.id, sub.id));

    // Also suspend tenant account
    await db.update(tenants).set({ status: "SUSPENDED", updatedAt: new Date() }).where(eq(tenants.id, sub.tenantId));

    await this.writeAudit({
      actor,
      action: "SUBSCRIPTION_CANCELLED",
      entityType: "Subscription",
      entityId: sub.id,
      tenantId: sub.tenantId,
      newValues: { status: "CANCELLED" },
    });

    return { id: sub.id, status: "CANCELLED" };
  }

  // =========================================================================
  // 6. PAYMENTS & INVOICING
  // =========================================================================
  async getPayments(query?: { search?: string; status?: string }) {
    const allPayments = await db.select().from(payments).orderBy(desc(payments.createdAt));
    const allTenants = await db.select().from(tenants);
    const tenantMap = new Map(allTenants.map((t) => [t.id, t.name]));

    let results = allPayments.map((p) => ({
      id: p.receiptNumber || p.orderId || `INV-${p.id.substring(0, 8).toUpperCase()}`,
      paymentUuid: p.id,
      company: tenantMap.get(p.tenantId) || "Enterprise Customer",
      tenantId: p.tenantId,
      amount: Number(p.amount),
      currency: p.currency,
      date: p.createdAt.toISOString().split("T")[0],
      status: p.status === "CAPTURED" || p.status === "PAID" ? "Paid" : p.status === "FAILED" ? "Overdue" : "Pending",
      method: p.method || "Razorpay / Bank Transfer",
      plan: "Enterprise Annual",
      orderId: p.orderId,
      paymentId: p.paymentId,
    }));

    if (query?.search) {
      const q = query.search.toLowerCase();
      results = results.filter((p) => p.company.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }

    if (query?.status && query.status !== "All") {
      results = results.filter((p) => p.status.toLowerCase() === query.status!.toLowerCase());
    }

    const totalRevenue = results.filter((p) => p.status === "Paid").reduce((acc, curr) => acc + curr.amount, 0);
    const overdueAmount = results.filter((p) => p.status === "Overdue").reduce((acc, curr) => acc + curr.amount, 0);

    return {
      payments: results,
      totalRevenue,
      overdueAmount,
    };
  }

  async markPaymentPaid(paymentIdOrReceipt: string, actor?: ActorContext) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(paymentIdOrReceipt);
    const whereClause = isUuid
      ? or(eq(payments.id, paymentIdOrReceipt), eq(payments.receiptNumber, paymentIdOrReceipt), eq(payments.orderId, paymentIdOrReceipt))
      : or(eq(payments.receiptNumber, paymentIdOrReceipt), eq(payments.orderId, paymentIdOrReceipt));

    let [paymentRecord] = await db
      .select()
      .from(payments)
      .where(whereClause)
      .limit(1);

    if (!paymentRecord) throw new NotFoundError("Payment record not found");

    await db
      .update(payments)
      .set({ status: "CAPTURED", updatedAt: new Date() })
      .where(eq(payments.id, paymentRecord.id));

    await this.writeAudit({
      actor,
      action: "PAYMENT_MARKED_PAID",
      entityType: "Payment",
      entityId: paymentRecord.id,
      tenantId: paymentRecord.tenantId,
      oldValues: { status: paymentRecord.status },
      newValues: { status: "CAPTURED" },
    });

    return { id: paymentIdOrReceipt, status: "Paid" };
  }

  async getInvoiceData(paymentIdOrReceipt: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(paymentIdOrReceipt);
    const whereClause = isUuid
      ? or(eq(payments.id, paymentIdOrReceipt), eq(payments.receiptNumber, paymentIdOrReceipt), eq(payments.orderId, paymentIdOrReceipt))
      : or(eq(payments.receiptNumber, paymentIdOrReceipt), eq(payments.orderId, paymentIdOrReceipt));

    let [paymentRecord] = await db
      .select()
      .from(payments)
      .where(whereClause)
      .limit(1);

    if (!paymentRecord) throw new NotFoundError("Invoice not found");

    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, paymentRecord.tenantId)).limit(1);

    const invoiceId = paymentRecord.receiptNumber || paymentRecord.orderId || paymentRecord.id;
    const companyName = tenant?.name || "Corporate Customer";
    const amount = Number(paymentRecord.amount);
    const status = paymentRecord.status === "CAPTURED" || paymentRecord.status === "PAID" ? "Paid" : paymentRecord.status;

    return {
      id: invoiceId,
      invoiceNumber: invoiceId,
      company: companyName,
      tenantId: paymentRecord.tenantId,
      plan: "Enterprise Annual",
      date: paymentRecord.createdAt.toISOString().split("T")[0],
      amount: amount,
      currency: paymentRecord.currency || "USD",
      status: status,
      customer: {
        name: companyName,
        id: tenant?.id,
      },
      paymentMethod: paymentRecord.method || "Razorpay / Bank Transfer",
      orderId: paymentRecord.orderId,
      paymentId: paymentRecord.paymentId,
      razorpayPaymentId: paymentRecord.paymentId || paymentRecord.orderId || "N/A",
      issuer: {
        company: "MaintenX OS Global Cloud Technologies Inc.",
        gstin: "23AABCM1234F1Z8",
        support: "billing@maintenx.com",
      },
    };
  }

  // =========================================================================
  // 7. MODULES & FEATURES
  // =========================================================================
  async getCompanyModules(companyId: string) {
    const modules = await db.select().from(tenantModules).where(eq(tenantModules.tenantId, companyId));
    const modulesMap: Record<string, boolean> = {
      plan: true,
      produce: true,
      verify: true,
      maintain: true,
      move: true,
      people: true,
      improve: true,
      intelligence: true,
    };

    for (const m of modules) {
      modulesMap[m.moduleKey] = m.isEnabled;
    }

    return modulesMap;
  }

  async toggleCompanyModule(companyId: string, moduleKey: string, isEnabled?: boolean, actor?: ActorContext) {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, companyId)).limit(1);
    if (!tenant) throw new NotFoundError("Company not found");

    const [existing] = await db
      .select()
      .from(tenantModules)
      .where(and(eq(tenantModules.tenantId, companyId), eq(tenantModules.moduleKey, moduleKey)))
      .limit(1);

    const newState = isEnabled !== undefined ? isEnabled : existing ? !existing.isEnabled : false;

    if (existing) {
      await db
        .update(tenantModules)
        .set({ isEnabled: newState, updatedAt: new Date() })
        .where(eq(tenantModules.id, existing.id));
    } else {
      await db.insert(tenantModules).values({
        tenantId: companyId,
        moduleKey,
        isEnabled: newState,
      });
    }

    await this.writeAudit({
      actor,
      action: "MODULE_ENTITLEMENT_TOGGLED",
      entityType: "TenantModule",
      entityId: `${companyId}:${moduleKey}`,
      tenantId: companyId,
      newValues: { moduleKey, isEnabled: newState },
    });

    return { companyId, moduleKey, isEnabled: newState };
  }

  // =========================================================================
  // 8. GLOBAL PLATFORM USERS
  // =========================================================================
  async getPlatformUsers(query?: { search?: string; status?: string }) {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    const allTenants = await db.select().from(tenants);
    const tenantMap = new Map(allTenants.map((t) => [t.id, t.name]));

    const allRoles = await db.select().from(roles);
    const roleMap = new Map(allRoles.map((r) => [r.id, r.name]));

    const allUserRoles = await db.select().from(userRoles);
    const userRoleMap = new Map<string, string>();
    for (const ur of allUserRoles) {
      if (!userRoleMap.has(ur.userId)) {
        userRoleMap.set(ur.userId, roleMap.get(ur.roleId) || "Operator");
      }
    }

    let results = allUsers.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      company: tenantMap.get(u.tenantId) || "Platform Enterprise",
      tenantId: u.tenantId,
      role: u.isMasterAdmin ? "Master Admin" : userRoleMap.get(u.id) || "Company Admin",
      status: u.status === "ACTIVE" ? "Active" : "Suspended",
      lastLogin: u.lastLoginAt ? u.lastLoginAt.toISOString().replace("T", " ").substring(0, 16) : "Never",
      createdAt: u.createdAt.toISOString().split("T")[0],
    }));

    if (query?.search) {
      const q = query.search.toLowerCase();
      results = results.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.company.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
      );
    }

    if (query?.status && query.status !== "All") {
      results = results.filter((u) => u.status.toLowerCase() === query.status!.toLowerCase());
    }

    return results;
  }

  async updateUserStatus(userId: string, newStatus: string, actor?: ActorContext) {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) throw new NotFoundError("User not found");

    const normalized = newStatus.toUpperCase() === "ACTIVE" ? "ACTIVE" : "SUSPENDED";
    await db.update(users).set({ status: normalized, updatedAt: new Date() }).where(eq(users.id, userId));

    await this.writeAudit({
      actor,
      action: "USER_STATUS_UPDATED",
      entityType: "User",
      entityId: userId,
      tenantId: user.tenantId,
      oldValues: { status: user.status },
      newValues: { status: normalized },
    });

    return { id: userId, status: normalized === "ACTIVE" ? "Active" : "Suspended" };
  }

  async deleteUser(userId: string, actor?: ActorContext) {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) throw new NotFoundError("User not found");

    await this.writeAudit({
      actor,
      action: "USER_DELETED",
      entityType: "User",
      entityId: userId,
      tenantId: user.tenantId,
      oldValues: { email: user.email, status: user.status },
      newValues: { deleted: true },
    });

    await db.delete(users).where(eq(users.id, userId));

    return { success: true, message: `User '${user.email}' deleted successfully.` };
  }


  // =========================================================================
  // 9. PLATFORM ANALYTICS
  // =========================================================================
  async getPlatformAnalytics() {
    const allTenants = await db.select().from(tenants);
    const allUsers = await db.select().from(users);
    const activeUsers = allUsers.filter((u) => u.status === "ACTIVE").length;

    // Subscription Distribution
    const subDist: Record<string, number> = {};
    for (const t of allTenants) {
      const p = t.plan || "Enterprise";
      subDist[p] = (subDist[p] || 0) + 1;
    }

    // Module Adoption Rate
    const allModules = await db.select().from(tenantModules);
    const moduleAdoptionCounts: Record<string, number> = {
      plan: 0,
      produce: 0,
      verify: 0,
      maintain: 0,
      move: 0,
      people: 0,
      improve: 0,
      intelligence: 0,
    };

    for (const m of allModules) {
      if (m.isEnabled && moduleAdoptionCounts[m.moduleKey] !== undefined) {
        moduleAdoptionCounts[m.moduleKey]++;
      }
    }

    // Recent telemetry count
    const telemetryResult = await pool.query("SELECT COUNT(*) as count FROM machine_telemetry");
    const telemetryCount = parseInt(telemetryResult.rows[0]?.count || "0", 10);

    return {
      totalCompanies: allTenants.length,
      totalUsers: allUsers.length,
      activeUsers,
      avgSession: "N/A (Requires Active Session Telemetry Ingest)",
      apiRequests: telemetryCount > 0 ? `${telemetryCount} Telemetry Ingests` : "N/A (Audit Logs Available)",
      subscriptionDistribution: subDist,
      moduleAdoption: moduleAdoptionCounts,
    };
  }

  // =========================================================================
  // 10. ACTIVITY & AUDIT LOGS
  // =========================================================================
  async getAuditLogs(query?: { search?: string; event?: string }) {
    const logs = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(100);
    const allUsers = await db.select().from(users);
    const userMap = new Map(allUsers.map((u) => [u.id, `${u.firstName} ${u.lastName}`]));

    let results = logs.map((l) => ({
      id: l.id,
      user: l.userId ? userMap.get(l.userId) || "Master Admin" : "System / Master Admin",
      event: l.action,
      target: `${l.entityType} (${l.entityId})`,
      date: l.createdAt.toISOString().replace("T", " ").substring(0, 19),
      ip: l.ipAddress || "127.0.0.1",
    }));

    if (query?.search) {
      const q = query.search.toLowerCase();
      results = results.filter((l) => l.user.toLowerCase().includes(q) || l.target.toLowerCase().includes(q) || l.event.toLowerCase().includes(q));
    }

    if (query?.event && query.event !== "All") {
      results = results.filter((l) => l.event === query.event);
    }

    return results;
  }

  // =========================================================================
  // 11. SUPPORT TICKETS
  // =========================================================================
  async getSupportTickets(query?: { search?: string; status?: string }) {
    const tickets = await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
    let results = tickets.map((t) => ({
      id: t.id,
      company: t.companyName,
      tenantId: t.tenantId,
      subject: t.subject,
      description: t.description,
      status: t.status,
      priority: t.priority,
      assignedTo: t.assignedTo,
      date: t.createdAt.toISOString().replace("T", " ").substring(0, 16),
      resolution: t.resolution,
    }));

    if (query?.search) {
      const q = query.search.toLowerCase();
      results = results.filter((t) => t.company.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q));
    }

    if (query?.status && query.status !== "All") {
      results = results.filter((t) => t.status.toLowerCase() === query.status!.toLowerCase());
    }

    return results;
  }

  async createSupportTicket(
    input: {
      companyName: string;
      subject: string;
      description?: string;
      priority?: string;
      tenantId?: string;
    },
    actor?: ActorContext
  ) {
    if (!input.companyName || !input.subject) {
      throw new ValidationError("Company name and subject are required");
    }

    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const [ticket] = await db
      .insert(supportTickets)
      .values({
        id: ticketId,
        companyName: input.companyName,
        tenantId: input.tenantId as any,
        subject: input.subject,
        description: input.description || null,
        priority: input.priority || "Medium",
        status: "Open",
      })
      .returning();

    await this.writeAudit({
      actor,
      action: "SUPPORT_TICKET_CREATED",
      entityType: "SupportTicket",
      entityId: ticket.id,
      tenantId: input.tenantId,
      newValues: input,
    });

    return ticket;
  }

  async updateTicketStatus(id: string, status: string, resolution?: string, actor?: ActorContext) {
    const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, id)).limit(1);
    if (!ticket) throw new NotFoundError("Ticket not found");

    const patch: any = { status, updatedAt: new Date() };
    if (resolution) patch.resolution = resolution;

    await db.update(supportTickets).set(patch).where(eq(supportTickets.id, id));

    await this.writeAudit({
      actor,
      action: "SUPPORT_TICKET_UPDATED",
      entityType: "SupportTicket",
      entityId: id,
      tenantId: ticket.tenantId,
      oldValues: { status: ticket.status },
      newValues: patch,
    });

    return { id, status, resolution };
  }

  async deleteSupportTicket(id: string, actor?: ActorContext) {
    const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, id)).limit(1);
    if (!ticket) throw new NotFoundError("Ticket not found");

    await this.writeAudit({
      actor,
      action: "SUPPORT_TICKET_DELETED",
      entityType: "SupportTicket",
      entityId: id,
      tenantId: ticket.tenantId,
      oldValues: { id: ticket.id, subject: ticket.subject, status: ticket.status },
      newValues: { deleted: true },
    });

    await db.delete(supportTickets).where(eq(supportTickets.id, id));

    return { success: true, message: `Ticket ${id} deleted successfully.` };
  }

  // =========================================================================
  // 12. PLATFORM SETTINGS
  // =========================================================================
  async getPlatformSettings() {
    let [settings] = await db.select().from(platformSettings).where(eq(platformSettings.id, "global")).limit(1);
    if (!settings) {
      [settings] = await db
        .insert(platformSettings)
        .values({
          id: "global",
          platformName: "MaintenX-OS",
          supportEmail: "support@maintenx.com",
        })
        .returning();
    }
    return settings;
  }

  async updatePlatformSettings(input: any, actor?: ActorContext) {
    const [existing] = await db.select().from(platformSettings).where(eq(platformSettings.id, "global")).limit(1);

    const patch: any = { updatedAt: new Date() };
    if (input.platformName !== undefined) patch.platformName = input.platformName;
    if (input.supportEmail !== undefined) patch.supportEmail = input.supportEmail;
    if (input.require2fa !== undefined) patch.require2fa = Boolean(input.require2fa);
    if (input.enforceStrongPasswords !== undefined) patch.enforceStrongPasswords = Boolean(input.enforceStrongPasswords);
    if (input.logAllIps !== undefined) patch.logAllIps = Boolean(input.logAllIps);
    if (input.maintenanceMode !== undefined) patch.maintenanceMode = Boolean(input.maintenanceMode);
    if (input.maintenanceMessage !== undefined) patch.maintenanceMessage = input.maintenanceMessage;
    if (input.defaultCurrency !== undefined) patch.defaultCurrency = input.defaultCurrency;
    if (input.smtpConfig) patch.smtpConfig = input.smtpConfig;
    if (input.branding) patch.branding = input.branding;

    const [updated] = await db
      .update(platformSettings)
      .set(patch)
      .where(eq(platformSettings.id, "global"))
      .returning();

    await this.writeAudit({
      actor,
      action: "PLATFORM_SETTINGS_UPDATED",
      entityType: "PlatformSettings",
      entityId: "global",
      oldValues: existing,
      newValues: patch,
    });

    return updated;
  }
}

export const masterAdminService = new MasterAdminService();
