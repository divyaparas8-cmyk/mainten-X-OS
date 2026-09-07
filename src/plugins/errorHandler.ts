import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { AppError } from "../shared/errors/AppError.js";
import { formatError } from "../shared/utils/responseFormatter.js";

export function errorHandler(error: FastifyError | Error, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error);

  // 1. Zod Validation Errors
  if (error instanceof ZodError) {
    const formattedIssues = error.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
      code: i.code,
    }));

    return reply.status(400).send(
      formatError("Request validation failed", "VALIDATION_ERROR", formattedIssues)
    );
  }

  // 2. Custom AppError Domain Errors (also check statusCode property for ESM/subclassing compatibility)
  if (error instanceof AppError || (error as any).statusCode) {
    const statusCode = (error as any).statusCode || 400;
    return reply.status(statusCode).send(
      formatError(error.message, (error as any).code || "APP_ERROR", (error as any).details)
    );
  }

  // 3. Fastify Schema Validation Errors
  if ("validation" in error && error.validation) {
    return reply.status(400).send(
      formatError(error.message, "VALIDATION_ERROR", error.validation)
    );
  }

  // 4. JWT Errors
  if (error.name === "JsonWebTokenError" || error.message.includes("jwt")) {
    return reply.status(401).send(
      formatError("Invalid or expired authentication token", "UNAUTHORIZED")
    );
  }

  // 5. Fallback Internal Server Error (Hide internal details in production)
  const isProd = process.env.NODE_ENV === "production";
  return reply.status(500).send(
    formatError(
      isProd ? "An internal server error occurred" : error.message,
      "INTERNAL_SERVER_ERROR"
    )
  );
}

