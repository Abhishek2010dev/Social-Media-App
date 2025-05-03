import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: [
    "./server/database/auth.schema.ts",
    "./server/database/post.schema.ts",
  ],
  out: "./migration",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
