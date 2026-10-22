CREATE TABLE `appointment_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`service` text NOT NULL,
	`preferred_date` text NOT NULL,
	`preferred_time` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`consent_version` text DEFAULT '2026-10-22' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `appointments_email_created` ON `appointment_requests` (`email`,`created_at`);