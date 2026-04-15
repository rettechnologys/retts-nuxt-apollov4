CREATE TABLE `pages` (
	`slug` text PRIMARY KEY NOT NULL,
	`title` text,
	`status` text,
	`type` text,
	`payload` text,
	`page_config` text,
	`settings` text,
	`published_at` text,
	`scheduled_at` text,
	`saved_at` text,
	`created_at` text
);
--> statement-breakpoint
CREATE TABLE `site_config` (
	`id` integer PRIMARY KEY NOT NULL,
	`site` text,
	`footer` text,
	`updated_at` text
);
