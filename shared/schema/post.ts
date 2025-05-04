import { z } from "zod";

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

export const createPostClientSchema = z.object({
	caption: z
		.string({
			required_error: "Please enter a caption",
			invalid_type_error: "Caption must be a text string",
		})
		.min(1, "Caption cannot be empty"),

	tags: z
		.string({
			required_error: "Please enter at least one tag",
			invalid_type_error: "Tags must be a comma-separated string",
		})
		.min(1, "Tags cannot be empty"),

	location: z
		.string({
			required_error: "Please enter a location",
			invalid_type_error: "Location must be a text string",
		})
		.min(1, "Location cannot be empty"),

	file: z
		.custom<File>((file) => file instanceof File, "You must upload an image")
		.refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
			message: "Only JPEG, PNG, or GIF images are allowed",
		})
		.refine((file) => file.size <= MAX_FILE_SIZE, {
			message: "Image must be 2MB or smaller",
		}),
});

export const createPostServerSchema = z.object({
	caption: z
		.string({
			required_error: "Please enter a caption",
			invalid_type_error: "Caption must be a text string",
		})
		.min(1, "Caption cannot be empty"),

	tags: z
		.string({
			required_error: "Please enter at least one tag",
			invalid_type_error: "Tags must be a comma-separated string",
		})
		.min(1, "Tags cannot be empty"),

	location: z
		.string({
			required_error: "Please enter a location",
			invalid_type_error: "Location must be a text string",
		})
		.min(1, "Location cannot be empty"),

	file: z
		.object({
			filename: z.string().min(1, "Filename is required"),
			type: z.enum(["image/jpeg", "image/png", "image/gif"], {
				errorMap: () => ({
					message: "Only JPEG, PNG, or GIF images are allowed",
				}),
			}),
			data: z
				.instanceof(Uint8Array, {
					message: "Image data must be a Uint8Array (binary)",
				})
				.refine((data) => data.length <= MAX_FILE_SIZE, {
					message: "Image must be 2MB or smaller",
				}),
		})
		.refine((file) => !!file.filename, {
			message: "An image file is required",
		}),
});
