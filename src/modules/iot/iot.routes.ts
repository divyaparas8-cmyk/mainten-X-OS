import { FastifyInstance } from "fastify";
import { iotController } from "./iot.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function iotRoutes(fastify: FastifyInstance) {
  // 1. High-frequency Edge Telemetry Ingestion (Edge Gateways push data here)
  fastify.post(
    "/telemetry/ingest",
    {
      schema: {
        tags: ["Industrial IoT & Telemetry"],
        summary: "Ingest & Normalize Machine Telemetry (OPC-UA, MQTT, Modbus, Edge Gateways)",
      },
    },
    iotController.ingest.bind(iotController)
  );

  // 2. Real-time Live SSE Telemetry Stream
  fastify.get(
    "/telemetry/stream",
    {
      schema: {
        tags: ["Industrial IoT & Telemetry"],
        summary: "Real-Time Server-Sent Events (SSE) Live Telemetry Stream",
      },
    },
    iotController.stream.bind(iotController)
  );

  // 3. Latest Telemetry Snapshot
  fastify.get(
    "/telemetry/latest",
    {
      schema: {
        tags: ["Industrial IoT & Telemetry"],
        summary: "Get Latest Normalized Telemetry Snapshot for Shopfloor Machines",
      },
    },
    iotController.getLatest.bind(iotController)
  );

  // 4. Telemetry Historical Log
  fastify.get(
    "/telemetry/history/:assetCode",
    {
      schema: {
        tags: ["Industrial IoT & Telemetry"],
        summary: "Query Historical Telemetry Logs for Specific Asset",
      },
    },
    iotController.getHistory.bind(iotController)
  );

  // 5. Configured Edge Gateways List
  fastify.get(
    "/gateways",
    {
      schema: {
        tags: ["Industrial IoT & Telemetry"],
        summary: "List Configured Industrial Edge Gateways and Brokers",
      },
    },
    iotController.getGateways.bind(iotController)
  );

  // 6. Simulator Control Endpoints (Authenticated)
  fastify.register(async (authScope) => {
    authScope.addHook("preHandler", authenticate);

    authScope.post(
      "/simulator/start",
      {
        schema: {
          tags: ["Industrial IoT & Telemetry"],
          summary: "Start High-Frequency Synthetic Telemetry Simulator",
        },
      },
      iotController.startSimulator.bind(iotController)
    );

    authScope.post(
      "/simulator/stop",
      {
        schema: {
          tags: ["Industrial IoT & Telemetry"],
          summary: "Stop High-Frequency Synthetic Telemetry Simulator",
        },
      },
      iotController.stopSimulator.bind(iotController)
    );
  });
}
