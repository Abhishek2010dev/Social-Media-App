export type AuthUser = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
	image?: string | null;
};
