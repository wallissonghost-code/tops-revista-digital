CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`whatsapp` text NOT NULL,
	`instagram` text DEFAULT '' NOT NULL,
	`category` text NOT NULL,
	`plan` text NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer NOT NULL
);
