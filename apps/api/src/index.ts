import "dotenv/config";
import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { loadEnv } from "./config.js";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.js";
import { catalogRoutes } from "./routes/catalog.js";
import { applicationRoutes } from "./routes/applications.js";
import { paymentRoutes } from "./routes/payments.js";

const env = loadEnv();

const app = Fastify({
  logger: true,
});

function allowedWebOrigins(): Set<string> {
  const primary = env.WEB_ORIGIN.replace(/\/$/, "");
  const set = new Set<string>([primary]);
  if (env.NODE_ENV === "development") {
    try {
      const u = new URL(primary);
      const portPart = u.port ? `:${u.port}` : "";
      if (u.hostname === "localhost") {
        set.add(`${u.protocol}//127.0.0.1${portPart}`);
      } else if (u.hostname === "127.0.0.1") {
        set.add(`${u.protocol}//localhost${portPart}`);
      }
    } catch {
      /* ignore invalid WEB_ORIGIN */
    }
  }
  return set;
}

const webOrigins = allowedWebOrigins();

await app.register(cors, {
  origin(origin, cb) {
    if (!origin) {
      cb(null, true);
      return;
    }
    if (webOrigins.has(origin)) {
      cb(null, true);
      return;
    }
    cb(null, false);
  },
  credentials: true,
});

await app.register(cookie);

await app.register(healthRoutes, { prefix: "/api" });
await app.register(authRoutes, { prefix: "/api", env });
await app.register(catalogRoutes, { prefix: "/api" });
await app.register(applicationRoutes, { prefix: "/api" });
await app.register(paymentRoutes, { prefix: "/api", env });

await app.listen({ port: env.PORT, host: "0.0.0.0" });
