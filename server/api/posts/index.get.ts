import { eq } from "drizzle-orm";
import { user } from "~/server/database/auth.schema";
import { db } from "~/server/database/client";
import { post } from "~/server/database/post.schema";

export default defineEventHandler(async () => {
	try {
		const result = await db
			.select({
				id: post.id,
				caption: post.caption,
				tags: post.tags,
				location: post.location,
				likes: post.likes,
				imageName: post.imageName,
				createdAt: post.createdAt,
				author: {
					name: user.name,
				},
			})
			.from(post)
			.leftJoin(user, eq(user.id, post.userId));
		return result;
	} catch (err) {
		console.error(err);
		if (err instanceof Error) {
			throw err;
		}

		throw createError({
			statusCode: 500,
			statusMessage: "Something went wrong",
		});
	}
});
