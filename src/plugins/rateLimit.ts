import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";
import { env } from "../config/env.js";

export default fp(async (fastify) => {
  await fastify.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
    allowList: ["127.0.0.1", "localhost"],
  });
});
