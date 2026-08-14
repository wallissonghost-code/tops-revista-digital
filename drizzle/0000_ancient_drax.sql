CREATE TABLE `editions` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`subtitle` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`cover_image` text DEFAULT '' NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `magazine_pages` (
	`id` text PRIMARY KEY NOT NULL,
	`edition_id` text NOT NULL,
	`position` integer NOT NULL,
	`label` text DEFAULT 'EDITORIAL' NOT NULL,
	`title` text NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`image_url` text DEFAULT '' NOT NULL,
	`layout` text DEFAULT 'editorial' NOT NULL
);
