import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations work best with Neon's direct (non-pooled) connection.
    // Fall back to DATABASE_URL to keep local development compatible.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
