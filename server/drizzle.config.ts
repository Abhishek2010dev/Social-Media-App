import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./database/auth.schema.ts"],
  out: "./migration",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
