CREATE TABLE `contracts` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_id` text NOT NULL,
	`client_name` text NOT NULL,
	`event_date` text NOT NULL,
	`venue` text NOT NULL,
	`service_package` text NOT NULL,
	`amount` real NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`vendor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `signatures` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_id` text NOT NULL,
	`type` text NOT NULL,
	`data` text NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`vendor_type` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);