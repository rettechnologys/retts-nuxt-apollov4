CREATE TABLE `collection_items` (
	`id` text PRIMARY KEY NOT NULL,
	`collection_slug` text,
	`data` text,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`slug` text PRIMARY KEY NOT NULL,
	`name` text,
	`icon` text,
	`description` text,
	`schema` text,
	`created_at` text,
	`updated_at` text
);
