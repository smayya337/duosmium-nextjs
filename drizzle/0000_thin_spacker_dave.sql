CREATE TABLE IF NOT EXISTS "events" (
	"name" text NOT NULL,
	"result_duosmium_id" text NOT NULL,
	"data" jsonb NOT NULL,
	CONSTRAINT events_result_duosmium_id_name PRIMARY KEY("result_duosmium_id","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "histograms" (
	"result_duosmium_id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "locations" (
	"name" text NOT NULL,
	"city" text DEFAULT '' NOT NULL,
	"state" text NOT NULL,
	"country" text DEFAULT 'United States' NOT NULL,
	CONSTRAINT locations_name_city_state_country PRIMARY KEY("name","city","state","country")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "penalties" (
	"team_number" integer NOT NULL,
	"result_duosmium_id" text NOT NULL,
	"data" jsonb NOT NULL,
	CONSTRAINT penalties_result_duosmium_id_team_number PRIMARY KEY("result_duosmium_id","team_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "placings" (
	"event_name" text NOT NULL,
	"team_number" integer NOT NULL,
	"result_duosmium_id" text NOT NULL,
	"data" jsonb NOT NULL,
	CONSTRAINT placings_result_duosmium_id_event_name_team_number PRIMARY KEY("result_duosmium_id","event_name","team_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "results" (
	"duosmium_id" text PRIMARY KEY NOT NULL,
	"logo" text NOT NULL,
	"color" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"official" boolean DEFAULT false NOT NULL,
	"preliminary" boolean DEFAULT false NOT NULL,
	"title" text NOT NULL,
	"full_title" text NOT NULL,
	"short_title" text NOT NULL,
	"full_short_title" text NOT NULL,
	"date" text NOT NULL,
	"location_name" text NOT NULL,
	"location_city" text DEFAULT '' NOT NULL,
	"location_state" text NOT NULL,
	"location_country" text DEFAULT 'United States' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"number" integer NOT NULL,
	"result_duosmium_id" text NOT NULL,
	"data" jsonb,
	"name" text NOT NULL,
	"city" text DEFAULT '' NOT NULL,
	"state" text NOT NULL,
	"country" text DEFAULT 'United States' NOT NULL,
	"track" text,
	CONSTRAINT teams_result_duosmium_id_number PRIMARY KEY("result_duosmium_id","number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournaments" (
	"result_duosmium_id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tracks" (
	"name" text NOT NULL,
	"result_duosmium_id" text NOT NULL,
	"data" jsonb NOT NULL,
	CONSTRAINT tracks_result_duosmium_id_name PRIMARY KEY("result_duosmium_id","name")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "events_result_duosmium_id_name_index" ON "events" ("result_duosmium_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "histograms_result_duosmium_id_index" ON "histograms" ("result_duosmium_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "locations_name_city_state_country_index" ON "locations" ("name","city","state","country");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "penalties_result_duosmium_id_team_number_index" ON "penalties" ("result_duosmium_id","team_number");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "placings_result_duosmium_id_event_name_team_number_index" ON "placings" ("result_duosmium_id","event_name","team_number");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "results_duosmium_id_index" ON "results" ("duosmium_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "teams_result_duosmium_id_number_index" ON "teams" ("result_duosmium_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tournaments_result_duosmium_id_index" ON "tournaments" ("result_duosmium_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tracks_result_duosmium_id_name_index" ON "tracks" ("result_duosmium_id","name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_result_duosmium_id_results_duosmium_id_fk" FOREIGN KEY ("result_duosmium_id") REFERENCES "results"("duosmium_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "histograms" ADD CONSTRAINT "histograms_result_duosmium_id_results_duosmium_id_fk" FOREIGN KEY ("result_duosmium_id") REFERENCES "results"("duosmium_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "penalties" ADD CONSTRAINT "penalties_result_duosmium_id_results_duosmium_id_fk" FOREIGN KEY ("result_duosmium_id") REFERENCES "results"("duosmium_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "placings" ADD CONSTRAINT "placings_result_duosmium_id_results_duosmium_id_fk" FOREIGN KEY ("result_duosmium_id") REFERENCES "results"("duosmium_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_result_duosmium_id_results_duosmium_id_fk" FOREIGN KEY ("result_duosmium_id") REFERENCES "results"("duosmium_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_result_duosmium_id_results_duosmium_id_fk" FOREIGN KEY ("result_duosmium_id") REFERENCES "results"("duosmium_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tracks" ADD CONSTRAINT "tracks_result_duosmium_id_results_duosmium_id_fk" FOREIGN KEY ("result_duosmium_id") REFERENCES "results"("duosmium_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
