import { relations } from 'drizzle-orm';
import {
	boolean,
	integer,
	jsonb,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	uuid
} from 'drizzle-orm/pg-core';

export const results = pgTable(
	'Result',
	{
		duosmiumId: text('duosmiumId').notNull().primaryKey(),
		logo: text('logo').notNull(),
		color: text('color').notNull(),
		createdAt: timestamp('createdAt').notNull(),
		updatedAt: timestamp('updatedAt').notNull(),
		official: boolean('official').default(false).notNull(),
		preliminary: boolean('preliminary').default(false).notNull(),
		title: text('title').notNull(),
		fullTitle: text('fullTitle').notNull(),
		shortTitle: text('shortTitle').notNull(),
		fullShortTitle: text('fullShortTitle').notNull(),
		date: text('date').notNull(),
		locationName: text('locationName').notNull(),
		locationCity: text('locationCity').default('').notNull(),
		locationState: text('locationState').notNull(),
		locationCountry: text('locationCountry').default('United States').notNull()
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

export const tournaments = pgTable(
	'Tournament',
	{
		resultDuosmiumId: text('resultDuosmiumId').notNull().primaryKey(),
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

export const teams = pgTable(
	'Team',
	{
		number: integer('number').notNull(),
		resultDuosmiumId: text('resultDuosmiumId').notNull(),
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

export const events = pgTable(
	'Event',
	{
		name: text('name').notNull(),
		resultDuosmiumId: text('resultDuosmiumId').notNull(),
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

export const tracks = pgTable(
	'Track',
	{
		name: text('name').notNull(),
		resultDuosmiumId: text('resultDuosmiumId').notNull(),
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

export const placings = pgTable(
	'Placing',
	{
		eventName: text('eventName').notNull(),
		teamNumber: integer('teamNumber').notNull(),
		resultDuosmiumId: text('resultDuosmiumId').notNull(),
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

export const penalties = pgTable(
	'Penalty',
	{
		teamNumber: integer('teamNumber').notNull(),
		resultDuosmiumId: text('resultDuosmiumId').notNull(),
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

export const histograms = pgTable(
	'Histogram',
	{
		resultDuosmiumId: text('resultDuosmiumId').notNull().primaryKey(),
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

export const locations = pgTable(
	'Location',
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
