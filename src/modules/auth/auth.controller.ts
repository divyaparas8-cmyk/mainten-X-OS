import { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "./auth.service.js";
import { loginSchema, digitalSignOffSchema } from "./auth.schema.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";
import { UnauthorizedError } from "../../shared/errors/AppError.js";
import { logAuditTrail } from "../../middleware/auditContext.js";

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const input = loginSchema.parse(request.body);
    const { user, tenant } = await authService.validateUserCredentials(input);

    const token = await reply.jwtSign({
      userId: user.id,
      email: user.email,
      tenantId: user.tenantId,
      plantId: user.plantId,
      role: user.role,
      permissions: ["*"],
      isMasterAdmin: user.isMasterAdmin,
    });

    await logAuditTrail({
      tenantId: user.tenantId,
      plantId: user.plantId,
      userId: user.id,
      action: "LOGIN",
      entityType: "UserSession",
      entityId: user.id,
      ipAddress: request.ip,
      userAgent: request.headers["user-agent"],
    });

    return reply.send(
      formatSuccess({
        token,
        user,
        tenant: tenant ? { id: tenant.id, name: tenant.name, slug: tenant.slug } : null,
      }, "Logged in successfully")
    );
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(
      formatSuccess({
        user: request.user,
      })
    );
  }

  async digitalSignOff(request: FastifyRequest, reply: FastifyReply) {
    const input = digitalSignOffSchema.parse(request.body);
    const user = request.user;

    const isValid = await authService.verifyDigitalSignaturePin(user.userId, input.pin);
    if (!isValid) {
      throw new UnauthorizedError("Invalid 21 CFR Part 11 Digital Signature PIN");
    }

    await logAuditTrail({
      tenantId: user.tenantId,
      plantId: user.plantId,
      userId: user.userId,
      action: "DIGITAL_SIGNATURE",
      entityType: input.entityType,
      entityId: input.entityId,
      newValues: { meaning: input.meaning, comments: input.comments },
      ipAddress: request.ip,
    });

    return reply.send(
      formatSuccess({
        signed: true,
        signedAt: new Date().toISOString(),
        signedBy: user.email,
      }, "Electronic signature verified and recorded (21 CFR Part 11)")
    );
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(formatSuccess(null, "Logged out cleanly"));
  }
}

export const authController = new AuthController();
