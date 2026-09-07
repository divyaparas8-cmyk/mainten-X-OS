import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../shared/errors/AppError.js";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw new UnauthorizedError("Authentication required: Please provide a valid Bearer token");
  }
}
