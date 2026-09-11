import bcrypt from "bcryptjs";
import { db } from "../../config/database.js";
import { users, roles, userRoles, tenants, plants } from "../../db/schema/index.js";
import { eq } from "drizzle-orm";
import { UnauthorizedError, NotFoundError } from "../../shared/errors/AppError.js";
import { LoginInput } from "./auth.schema.js";

export class AuthService {
  async validateUserCredentials(input: LoginInput) {
    const [user] = await db.select().from(users).where(eq(users.email, input.email.toLowerCase())).limit(1);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (user.status !== "ACTIVE") {
      throw new UnauthorizedError("Your account has been deactivated. Please contact your system administrator.");
    }

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Get user's active tenant
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, user.tenantId)).limit(1);

    // Get user's roles
    const userRoleRecords = await db.select().from(userRoles).where(eq(userRoles.userId, user.id));
    let primaryRole = "operator";

    if (userRoleRecords.length > 0) {
      const [roleRecord] = await db.select().from(roles).where(eq(roles.id, userRoleRecords[0].roleId)).limit(1);
      if (roleRecord) primaryRole = roleRecord.code;
    }

    if (user.isMasterAdmin) {
      primaryRole = "master_admin";
    }

    // Get default plant
    const [defaultPlant] = await db.select().from(plants).where(eq(plants.tenantId, user.tenantId)).limit(1);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tenantId: user.tenantId,
        plantId: input.plantId || defaultPlant?.id,
        role: primaryRole,
        isMasterAdmin: user.isMasterAdmin,
        avatarUrl: user.avatarUrl,
      },
      tenant,
    };
  }

  async verifyDigitalSignaturePin(userId: string, pin: string): Promise<boolean> {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user || !user.digitalSignaturePinHash) return false;
    return await bcrypt.compare(pin, user.digitalSignaturePinHash);
  }
}

export const authService = new AuthService();
