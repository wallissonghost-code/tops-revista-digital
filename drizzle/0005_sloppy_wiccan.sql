CREATE TABLE `articles` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text DEFAULT '' NOT NULL,
	`category` text DEFAULT 'EDITORIAL' NOT NULL,
	`author` text DEFAULT 'Equipe DEU CAPA.' NOT NULL,
	`subject` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`cover_image` text DEFAULT '' NOT NULL,
	`instagram` text DEFAULT '' NOT NULL,
	`contact` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`scheduled_at` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);