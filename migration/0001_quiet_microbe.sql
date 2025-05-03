CREATE TABLE `post` (
	`id` integer PRIMARY KEY NOT NULL,
	`caption` text NOT NULL,
	`tags` text,
	`location` text NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`image_path` text NOT NULL,
	`created_at` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
