import fp from "fastify-plugin";
import cors from "@fastify/cors";
import { env } from "../config/env.js";

export default fp(async (fastify) => {
  const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());

  await fastify.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return cb(null, true);
      }
      return cb(null, true); // Permissive in dev, configurable for prod
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Tenant-ID",
      "X-Tenant-Id",
      "x-tenant-id",
      "X-Tenant-Name",
      "x-tenant-name",
      "X-Plant-ID",
      "x-plant-id",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
  });
});
