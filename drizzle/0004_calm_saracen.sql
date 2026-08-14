CREATE TABLE `album_photos` (
	`id` text PRIMARY KEY NOT NULL,
	`album_id` text NOT NULL,
	`image_url` text NOT NULL,
	`caption` text DEFAULT '' NOT NULL,
	`position` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`type` text DEFAULT 'EVENTO' NOT NULL,
	`event_date` text NOT NULL,
	`event_time` text DEFAULT '' NOT NULL,
	`place` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`image_url` text DEFAULT '' NOT NULL,
	`ticket_url` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `photo_albums` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`cover_image` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`allow_download` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
