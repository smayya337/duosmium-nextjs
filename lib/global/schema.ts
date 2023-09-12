import { relations, type InferModel } from 'drizzle-orm';
import {
	boolean,
	integer,
	jsonb,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core';

export const results = pgTable(
	'results',
	{
		duosmiumId: text('duosmium_id').notNull().primaryKey(),
		logo: text('logo').notNull(),
		color: text('color').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').notNull(),
		official: boolean('official').default(false).notNull(),
		preliminary: boolean('preliminary').default(false).notNull(),
		title: text('title').notNull(),
		fullTitle: text('full_title').notNull(),
		shortTitle: text('short_title').notNull(),
		fullShortTitle: text('full_short_title').notNull(),
		date: text('date').notNull(),
		locationName: text('location_name').notNull(),
		locationCity: text('location_city').default('').notNull(),
		locationState: text('location_state').notNull(),
		locationCountry: text('location_country').default('United States').notNull()
	},
	(table) => {
		return {
			idx: uniqueIndex().on(table.duosmiumId)
		};
	}
);

export const resultsRelations = relations(results, ({ one, many }) => ({
	location: one(locations, {
		fields: [
			results.locationName,
			results.locationCity,
			results.locationState,
			results.locationCountry
		],
		references: [locations.name, locations.city, locations.state, locations.country]
	}),
	tournament: one(tournaments, {
		fields: [results.duosmiumId],
		references: [tournaments.resultDuosmiumId]
	}),
	teams: many(teams),
	tracks: many(tracks),
	placings: many(placings),
	penalties: many(penalties),
	histogram: one(histograms, {
		fields: [results.duosmiumId],
		references: [histograms.resultDuosmiumId]
	})
}));

export type Result = InferModel<typeof results>;

export const tournaments = pgTable(
	'tournaments',
	{
		resultDuosmiumId: text('result_duosmium_id')
			.notNull()
			.primaryKey()
			.references(() => results.duosmiumId, { onDelete: 'cascade', onUpdate: 'cascade' }),
		data: jsonb('data').notNull()
	},
	(table) => {
		return {
			idx: uniqueIndex().on(table.resultDuosmiumId)
		};
	}
);

export const tournamentsRelations = relations(tournaments, ({ one }) => ({
	result: one(results, {
		fields: [tournaments.resultDuosmiumId],
		references: [results.duosmiumId]
	})
}));

export type Tournament = InferModel<typeof tournaments>;

export const teams = pgTable(
	'teams',
	{
		number: integer('number').notNull(),
		resultDuosmiumId: text('result_duosmium_id')
			.notNull()
			.references(() => results.duosmiumId, { onDelete: 'cascade', onUpdate: 'cascade' }),
		data: jsonb('data'),
		name: text('name').notNull(),
		city: text('city').default('').notNull(),
		state: text('state').notNull(),
		country: text('country').default('United States').notNull(),
		track: text('track')
	},
	(table) => {
		return {
			pk: primaryKey(table.resultDuosmiumId, table.number),
			idx: uniqueIndex().on(table.resultDuosmiumId, table.number)
		};
	}
);

export const teamsRelations = relations(teams, ({ one, many }) => ({
	result: one(results, {
		fields: [teams.resultDuosmiumId],
		references: [results.duosmiumId]
	}),
	placings: many(placings),
	penalties: many(penalties),
	track: one(tracks, {
		fields: [teams.resultDuosmiumId, teams.track],
		references: [tracks.resultDuosmiumId, tracks.name]
	}),
	location: one(locations, {
		fields: [teams.name, teams.city, teams.state, teams.country],
		references: [locations.name, locations.city, locations.state, locations.country]
	})
}));

export type Team = InferModel<typeof teams>;

export const events = pgTable(
	'events',
	{
		name: text('name').notNull(),
		resultDuosmiumId: text('result_duosmium_id')
			.notNull()
			.references(() => results.duosmiumId, { onDelete: 'cascade', onUpdate: 'cascade' }),
		data: jsonb('data').notNull()
		// placings
	},
	(table) => {
		return {
			pk: primaryKey(table.resultDuosmiumId, table.name),
			idx: uniqueIndex().on(table.resultDuosmiumId, table.name)
		};
	}
);

export const eventsRelations = relations(events, ({ one, many }) => ({
	result: one(results, {
		fields: [events.resultDuosmiumId],
		references: [results.duosmiumId]
	}),
	placings: many(placings)
}));

export type Event = InferModel<typeof events>;

export const tracks = pgTable(
	'tracks',
	{
		name: text('name').notNull(),
		resultDuosmiumId: text('result_duosmium_id')
			.notNull()
			.references(() => results.duosmiumId, { onDelete: 'cascade', onUpdate: 'cascade' }),
		data: jsonb('data').notNull()
	},
	(table) => {
		return {
			pk: primaryKey(table.resultDuosmiumId, table.name),
			idx: uniqueIndex().on(table.resultDuosmiumId, table.name)
		};
	}
);

export const tracksRelations = relations(tracks, ({ one, many }) => ({
	result: one(results, {
		fields: [tracks.resultDuosmiumId],
		references: [results.duosmiumId]
	}),
	teams: many(teams)
}));

export type Track = InferModel<typeof tracks>;

export const placings = pgTable(
	'placings',
	{
		eventName: text('event_name').notNull(),
		teamNumber: integer('team_number').notNull(),
		resultDuosmiumId: text('result_duosmium_id')
			.notNull()
			.references(() => results.duosmiumId, { onDelete: 'cascade', onUpdate: 'cascade' }),
		data: jsonb('data').notNull()
	},
	(table) => {
		return {
			pk: primaryKey(table.resultDuosmiumId, table.eventName, table.teamNumber),
			idx: uniqueIndex().on(table.resultDuosmiumId, table.eventName, table.teamNumber)
		};
	}
);

export const placingsRelations = relations(placings, ({ one }) => ({
	result: one(results, {
		fields: [placings.resultDuosmiumId],
		references: [results.duosmiumId]
	}),
	team: one(teams, {
		fields: [placings.teamNumber],
		references: [teams.number]
	}),
	event: one(events, {
		fields: [placings.eventName],
		references: [events.name]
	})
}));

export type Placing = InferModel<typeof placings>;

export const penalties = pgTable(
	'penalties',
	{
		teamNumber: integer('team_number').notNull(),
		resultDuosmiumId: text('result_duosmium_id')
			.notNull()
			.references(() => results.duosmiumId, { onDelete: 'cascade', onUpdate: 'cascade' }),
		data: jsonb('data').notNull()
	},
	(table) => {
		return {
			pk: primaryKey(table.resultDuosmiumId, table.teamNumber),
			idx: uniqueIndex().on(table.resultDuosmiumId, table.teamNumber)
		};
	}
);

export const penaltiesRelations = relations(penalties, ({ one }) => ({
	result: one(results, {
		fields: [penalties.resultDuosmiumId],
		references: [results.duosmiumId]
	}),
	team: one(teams, {
		fields: [penalties.teamNumber],
		references: [teams.number]
	})
}));

export type Penalty = InferModel<typeof penalties>;

export const histograms = pgTable(
	'histograms',
	{
		resultDuosmiumId: text('result_duosmium_id')
			.notNull()
			.primaryKey()
			.references(() => results.duosmiumId, { onDelete: 'cascade', onUpdate: 'cascade' }),
		data: jsonb('data').notNull()
	},
	(table) => {
		return {
			idx: uniqueIndex().on(table.resultDuosmiumId)
		};
	}
);

export const histogramsRelations = relations(histograms, ({ one }) => ({
	result: one(results, {
		fields: [histograms.resultDuosmiumId],
		references: [results.duosmiumId]
	})
}));

export type Histogram = InferModel<typeof histograms>;

export const locations = pgTable(
	'locations',
	{
		name: text('name').notNull(),
		city: text('city').default('').notNull(),
		state: text('state').notNull(),
		country: text('country').default('United States').notNull()
	},
	(table) => {
		return {
			pk: primaryKey(table.name, table.city, table.state, table.country),
			idx: uniqueIndex().on(table.name, table.city, table.state, table.country)
		};
	}
);

export const locationsRelations = relations(locations, ({ many }) => ({
	results: many(results),
	teams: many(teams)
}));

export type Location = InferModel<typeof locations>;
