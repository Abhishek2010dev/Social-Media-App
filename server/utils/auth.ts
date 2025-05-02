import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../database/client";
import schema from "../database/auth.schema";

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
});
