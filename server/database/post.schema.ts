import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth.schema";

export const post = sqliteTable("post", {
	id: integer("id").primaryKey(),
	caption: text("caption").notNull(),
	tags: text("tags").notNull(),
	location: text("location").notNull(),
	likes: integer("likes").default(0),
	imageName: text("image_name").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});
