import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../config/database.js";
import { tenants, plants, users } from "../db/schema/index.js";
import { eq } from "drizzle-orm";

export async function authenticate(request: FastifyRequest, _reply: FastifyReply) {
  const headerTenantId = (request.headers["x-tenant-id"] as string | undefined)?.trim();
  const headerTenantName = (request.headers["x-tenant-name"] as string | undefined)?.trim();

  try {
    if (request.headers.authorization) {
      await request.jwtVerify();
    }
  } catch {
    // JWT verification failed — continue to header-based scoping
  }

  const currentUser = (request as any).user;

  // 1. If JWT decoded successfully
  if (currentUser) {
    if (headerTenantId) {
      // If user is master admin or switching tenant context, honor the header
      if (currentUser.isMasterAdmin || !currentUser.tenantId) {
        currentUser.tenantId = headerTenantId;
      }
    }
    return;
  }

  // 2. If JWT was missing or invalid, but X-Tenant-Id header was provided
  if (headerTenantId) {
    try {
      const [t] = await db.select().from(tenants).where(eq(tenants.id, headerTenantId)).limit(1);
      if (t) {
        (request as any).user = {
          id: `admin-${t.id}`,
          tenantId: t.id,
          role: "admin",
          email: `admin@${t.slug || "maintenx.com"}`,
          isMasterAdmin: false,
        };
        return;
      }
    } catch (e: any) {
      console.warn("authenticate headerTenantId lookup failed:", e.message);
    }
  }

  // 3. If X-Tenant-Name was provided
  if (headerTenantName) {
    try {
      const [t] = await db.select().from(tenants).where(eq(tenants.name, headerTenantName)).limit(1);
      if (t) {
        (request as any).user = {
          id: `admin-${t.id}`,
          tenantId: t.id,
          role: "admin",
          email: `admin@${t.slug || "maintenx.com"}`,
          isMasterAdmin: false,
        };
        return;
      }
    } catch (e: any) {
      console.warn("authenticate headerTenantName lookup failed:", e.message);
    }
  }

  // 4. If no tenant context is established, do NOT attach a random tenant
  (request as any).user = undefined;
}

