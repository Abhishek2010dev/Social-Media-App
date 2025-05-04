import { H3Error } from "h3";
import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Zod schema for the entire form (username + file)
const UploadSchema = z.object({
	username: z.string().min(3).max(30), // Username validation
	file: z
		.object({
			filename: z.string().min(1),
			type: z.enum(["image/jpeg", "image/png", "image/gif"]),
			data: z
				.instanceof(Uint8Array)
				.refine((data) => data.length <= MAX_FILE_SIZE, {
					message: "File exceeds maximum size of 2MB",
				}),
		})
		.refine((file) => !!file.filename, {
			message: "File is required",
		}),
});

export default defineEventHandler(async (event) => {
	try {
		const formData = await readMultipartFormData(event);
		if (!formData || formData.length === 0) {
			throw createError({
				statusCode: 400,
				statusMessage: "No form data provided",
			});
		}

		// Extract the file and username from form data
		const file = formData.find((f) => f.type);
		const usernameField = formData.find(
			(f) => !f.type && f.name === "username",
		);

		if (!file || !usernameField) {
			throw createError({
				statusCode: 400,
				statusMessage: "Username or file not provided",
			});
		}

		const form = {
			username: usernameField.data.toString(),
			file: {
				filename: file.filename,
				type: file.type,
				data: file.data,
			},
		};

		// Zod validation of the entire form (file + username)
		const result = UploadSchema.safeParse(form);
		if (!result.success) {
			throw createError({
				statusCode: 400,
				statusMessage: result.error.issues.map((i) => i.message).join(", "),
			});
		}

		// Proceed with storing the file
		const sanitizedFilename = file.filename
			.replace(/[^a-z0-9.\-_]/gi, "_")
			.toLowerCase();
		const uniqueFilename = `${Date.now()}-${sanitizedFilename}`;

		const storage = useStorage("uploads");
		await storage.setItemRaw(uniqueFilename, file.data);

		return {
			filename: uniqueFilename,
			username: result.data.username,
			url: `/uploads/${uniqueFilename}`,
		};
	} catch (error) {
		if (error instanceof H3Error) {
			throw error;
		}
		throw createError({
			statusCode: 500,
			statusMessage: "Error uploading file",
		});
	}
});
