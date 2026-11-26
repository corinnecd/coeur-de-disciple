CREATE TYPE "public"."meditation_rhythm" AS ENUM('daily', 'weekdays', 'three_days');--> statement-breakpoint
ALTER TABLE "user_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "meditation_rhythm" "meditation_rhythm" DEFAULT 'daily' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "reminder_time" time DEFAULT '07:00:00' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "auth_user_id" text DEFAULT (auth.user_id()) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "users_auth_user_id_unique" ON "users" USING btree ("auth_user_id");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "user_profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (select 1 from "users" where "users"."id" = "user_profiles"."user_id" and "users"."auth_user_id" = (select auth.user_id())));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "user_profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (select 1 from "users" where "users"."id" = "user_profiles"."user_id" and "users"."auth_user_id" = (select auth.user_id())));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "user_profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (select 1 from "users" where "users"."id" = "user_profiles"."user_id" and "users"."auth_user_id" = (select auth.user_id()))) WITH CHECK (exists (select 1 from "users" where "users"."id" = "user_profiles"."user_id" and "users"."auth_user_id" = (select auth.user_id())));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "user_profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (select 1 from "users" where "users"."id" = "user_profiles"."user_id" and "users"."auth_user_id" = (select auth.user_id())));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "users" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "users"."auth_user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "users" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "users"."auth_user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "users" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "users"."auth_user_id")) WITH CHECK ((select auth.user_id() = "users"."auth_user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "users" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "users"."auth_user_id"));--> statement-breakpoint
GRANT USAGE ON SCHEMA "public" TO "authenticated";--> statement-breakpoint
GRANT USAGE ON TYPE "public"."meditation_rhythm" TO "authenticated";--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "users", "user_profiles" TO "authenticated";
