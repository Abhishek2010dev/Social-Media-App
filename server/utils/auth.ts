import type { User } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../database/client";
import { sendEmail } from "./email";

const emailVerification = {
	sendVerificationEmail: async ({ user, url }: { user: User; url: string }) => {
		await sendEmail({
			to: user.email,
			subject: "Verify Your Email Address for Snapverse",
			text: `Hi ${user.name || "there"},\n\nThank you for signing up for Snapverse!\n\nTo complete your registration, please verify your email address by clicking the link below:\n\n${url}\n\nThis link will expire in 1 hour. If you didn't request this, please ignore this message.\n\nThanks,\nThe Snapverse Team`,
			html: `
				<p>Hi ${user.name || "there"},</p>
				<p>Thank you for signing up for <strong>Snapverse</strong>!</p>
				<p>To complete your registration, please verify your email address by clicking the button below:</p>
				<p><a href="${url}" style="background: #007bff; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none;">Verify Email</a></p>
				<p>This link will expire in 1 hour.</p>
				<p>If you did not sign up, you can safely ignore this email.</p>
				<p>– The Snapverse Team</p>
			`,
		});
	},
	sendOnSignUp: true,
	expiresIn: 3600,
	requireEmailVerification: true,
	autoSignInAfterVerification: true,
};

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	emailVerification: emailVerification,
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		},
	},
});
