import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

if (process.env.NODE_ENV === "production" && (!process.env.JWT_SECRET || !process.env.COOKIE_SECRET || !process.env.ORDER_ACCESS_SECRET || !process.env.INQUIRY_PROXY_SECRET)) {
  throw new Error("Production authentication and proxy secrets must be configured.");
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    ...(process.env.NODE_ENV !== "production" ? { databaseDriverOptions: { ssl: false, sslmode: "disable" } } : {}),
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET || "local-development-only-jwt-secret",
      cookieSecret: process.env.COOKIE_SECRET || "local-development-only-cookie-secret",
    },
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
    vite: () => ({ server: { host: "0.0.0.0", allowedHosts: ["localhost", "127.0.0.1"] } }),
  },
  modules: [
    { resolve: "./src/modules/inquiries" },
    { resolve: "./src/modules/digital" },
  ],
});
