CREATE TABLE `editorial_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`label` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`href` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `editorial_categories_slug_unique` ON `editorial_categories` (`slug`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
