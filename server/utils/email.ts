import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

interface EmailOptions {
	to: string | string[];
	subject: string;
	text?: string;
	html?: string;
}

export async function sendEmail({
	to,
	subject,
	text,
	html,
}: EmailOptions): Promise<void> {
	try {
		const { data, error } = await resend.emails.send({
			from: process.env.SENDER_EMAIL_ID!,
			to,
			subject,
			text,
			html,
			react: undefined,
		});

		if (error) {
			console.error("Error sending email:", error);
			throw error;
		}

		console.log("Email sent:", data);
	} catch (err) {
		console.error("Unexpected error:", err);
		throw err;
	}
}
