import { z } from "zod";

export const postSchema = z.object({
	id: z
		.number({
			invalid_type_error: "Post ID must be a number",
		})
		.int("Post ID must be an integer")
		.optional(),

	caption: z
		.string({
			required_error: "Caption is required",
			invalid_type_error: "Caption must be a string",
		})
		.min(1, "Caption cannot be empty"),

	tags: z.array(z.string({ invalid_type_error: "Each tag must be a string" }), {
		invalid_type_error: "Tags must be an array of strings",
		required_error: "Tags are required",
	}),

	location: z
		.string({
			required_error: "Location is required",
			invalid_type_error: "Location must be a string",
		})
		.min(1, "Location cannot be empty"),

	likes: z
		.number({
			invalid_type_error: "Likes must be a number",
		})
		.int("Likes must be an integer")
		.nonnegative("Likes cannot be negative")
		.default(0),

	imagePath: z
		.string({
			required_error: "Image path is required",
			invalid_type_error: "Image path must be a string",
		})
		.min(1, "Image path cannot be empty"),

	createdAt: z
		.date({
			required_error: "Creation date is required",
			invalid_type_error: "CreatedAt must be a valid Date object",
		})
		.optional(),

	userId: z
		.string({
			required_error: "User ID is required",
			invalid_type_error: "User ID must be a string",
		})
		.min(1, "User ID cannot be empty")
		.optional(),
});
