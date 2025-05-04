PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_post` (
	`id` integer PRIMARY KEY NOT NULL,
	`caption` text NOT NULL,
	`tags` text NOT NULL,
	`location` text NOT NULL,
	`likes` integer DEFAULT 0,
	`image_name` text NOT NULL,
	`created_at` integer DEFAULT '"2025-05-04T11:35:10.059Z"',
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_post`("id", "caption", "tags", "location", "likes", "image_name", "created_at", "user_id") SELECT "id", "caption", "tags", "location", "likes", "image_name", "created_at", "user_id" FROM `post`;--> statement-breakpoint
DROP TABLE `post`;--> statement-breakpoint
ALTER TABLE `__new_post` RENAME TO `post`;--> statement-breakpoint
PRAGMA foreign_keys=ON;