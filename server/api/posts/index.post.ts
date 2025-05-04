import { H3Error, type MultiPartData } from "h3";
import { db } from "~/server/database/client";
import { post } from "~/server/database/post.schema";
import type { AuthUser } from "~/shared/types/auth";

export default defineEventHandler(async (event) => {
	try {
		console.log("I am called");
		const formData = await readMultipartFormData(event);
		if (!formData || formData.length === 0) {
			throw createError({
				statusCode: 400,
				statusMessage: "No form data provided",
			});
		}

		const [data, error] = parseMultiPartFormData(formData);
		if (error || !data) {
			throw createError({
				statusCode: 400,
				statusMessage: error?.message || "Invalid form data",
			});
		}

		if (
			!data.image.filename ||
			!data.image.type ||
			!data.image.data ||
			!(data.image.data instanceof Uint8Array)
		) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid image file",
			});
		}

		if (!["image/jpeg", "image/png", "image/gif"].includes(data.image.type)) {
			throw createError({
				statusCode: 400,
				statusMessage: "Only JPEG, PNG, or GIF images are allowed",
			});
		}

		if (data.image.data.length > MAX_FILE_SIZE) {
			throw createError({
				statusCode: 400,
				statusMessage: "Image must be 2MB or smaller",
			});
		}

		const safeFilename = data.image.filename.replace(/[^a-z0-9.-]/gi, "_");
		const filename = `${Date.now()}-${safeFilename}`;

		const storage = useStorage("uploads");
		await storage.setItemRaw(filename, data.image.data);

		const user: AuthUser = event.context.auth.user;

		await db.insert(post).values({
			location: data.location,
			tags: data.tags,
			caption: data.caption,
			imageName: filename,
			userId: user.id,
		});

		return { success: true };
	} catch (err) {
		console.error(err);
		if (err instanceof H3Error) {
			throw err;
		}

		throw createError({
			statusCode: 500,
			statusMessage: "Something went wrong",
		});
	}
});

type CreatePostPayload = {
	location: string;
	tags: string;
	caption: string;
	image: Required<Pick<MultiPartData, "filename" | "type" | "data">>;
};

function parseMultiPartFormData(
	data: MultiPartData[],
): [CreatePostPayload | null, Error | null] {
	if (!data?.length) return [null, new Error("Form data is missing or empty.")];

	const image = data.find(
		(f): f is Required<Pick<MultiPartData, "filename" | "type" | "data">> =>
			Boolean(f.type && f.filename && f.data),
	);

	if (!image) return [null, new Error("Image data is missing or incomplete.")];

	const getFormData = (key: string) =>
		data.find((f) => !f.type && f.name === key)?.data?.toString();

	const caption = getFormData("caption");
	const location = getFormData("location");
	const tags = getFormData("tags");

	if (!caption || !location || !tags) {
		return [
			null,
			new Error(
				"Missing form data: " +
				(!caption ? "caption" : !location ? "location" : "tags"),
			),
		];
	}

	return [
		{
			caption,
			location,
			tags,
			image,
		},
		null,
	];
}
export const MAX_FILE_SIZE = 2 * 1024 * 1024;
