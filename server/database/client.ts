import { drizzle } from "drizzle-orm/libsql";
import * as authSchema from "./auth.schema";
import * as postSchema from "./post.schema";

export const db = drizzle({
	schema: {
		...authSchema,
	},
	connection: {
		url: process.env.DATABASE_URL!,
	},
});
