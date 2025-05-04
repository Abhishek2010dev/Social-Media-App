export default defineEventHandler(async (event) => {
	const pathname = event.path;

	if (!pathname.startsWith("/api") || pathname.startsWith("/api/auth")) return;

	const session = await auth.api.getSession({ headers: event.headers });
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
	}

	event.context.auth = session;
});
