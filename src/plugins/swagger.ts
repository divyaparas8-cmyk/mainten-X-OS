import fp from "fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export default fp(async (fastify) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "MaintenX OS — Manufacturing Operations SaaS REST API",
        description: "Production-ready API for MES, APS Planning, QMS (21 CFR Part 11), WMS 360° Traceability, and CMMS Maintenance.",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:4000",
          description: "Local Development Server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Enter your JWT token (e.g. from /api/v1/auth/login)",
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    staticCSP: true,
  });
});
