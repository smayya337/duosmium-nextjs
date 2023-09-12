// noinspection ES6RedundantAwait

import { addEvent, createEventDataInput } from '@/lib/events/async';
import { db, keepTryingUntilItWorks } from '@/lib/global/drizzle';
import { STATES_BY_POSTAL_CODE } from '@/lib/global/helpers';
import {
	events,
	histograms,
	penalties,
	placings,
	results,
	teams,
	tournaments,
	tracks
} from '@/lib/global/schema';
import { addHistogram, createHistogramDataInput } from '@/lib/histograms/async';
import { addLocation, createLocationDataInput } from '@/lib/locations/async';
import { addPenalty, createPenaltyDataInput } from '@/lib/penalties/async';
import { addPlacing, createPlacingDataInput } from '@/lib/placings/async';
import { createBgColorFromImagePath } from '@/lib/results/color';
import { createLogoPath } from '@/lib/results/logo';
import { addTeam, createTeamDataInput } from '@/lib/teams/async';
import { addTournament, createTournamentDataInput } from '@/lib/tournaments/async';
import { addTrack, createTrackDataInput } from '@/lib/tracks/async';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { load } from 'js-yaml';
import { cache } from 'react';
// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import {
	dateString,
	fullTournamentTitle,
	fullTournamentTitleShort,
	generateFilename,
	tournamentTitle,
	tournamentTitleShort
} from './helpers';
import { getInterpreter } from './interpreter';
import { ResultsAddQueue } from './queue';

export async function getResult(duosmiumID: string) {
	return (await db.selectDistinct().from(results).where(eq(results.duosmiumId, duosmiumID)))[0];
}

async function getCompleteResultData(duosmiumID: string) {
	const [tournamentData, eventData, trackData, teamData, placingData, penaltyData, histogramData] =
		await db.transaction(async (tx) => {
			return [
				(
					await tx
						.selectDistinct()
						.from(tournaments)
						.where(eq(tournaments.resultDuosmiumId, duosmiumID))
				)[0],
				await tx.select().from(events).where(eq(events.resultDuosmiumId, duosmiumID)),
				await tx.select().from(tracks).where(eq(tracks.resultDuosmiumId, duosmiumID)),
				await tx.select().from(teams).where(eq(teams.resultDuosmiumId, duosmiumID)),
				await tx.select().from(placings).where(eq(placings.resultDuosmiumId, duosmiumID)),
				await tx.select().from(penalties).where(eq(penalties.resultDuosmiumId, duosmiumID)),
				(await tx.select().from(histograms).where(eq(histograms.resultDuosmiumId, duosmiumID)))[0]
			];
		});
	return [tournamentData, eventData, trackData, teamData, placingData, penaltyData, histogramData];
}

export async function getCompleteResult(duosmiumID: string) {
	// @ts-ignore
	const [tournamentData, eventData, trackData, teamData, placingData, penaltyData, histogramData] =
		await getCompleteResultData(duosmiumID);
	const output = {};
	if (tournamentData) {
		// @ts-ignore
		output['Tournament'] = tournamentData.data;
	}
	// @ts-ignore
	if (eventData.length > 0) {
		// @ts-ignore
		output['Events'] = eventData.map((i) => i.data);
	}
	// @ts-ignore
	if (trackData.length > 0) {
		// @ts-ignore
		output['Tracks'] = trackData.map((i) => i.data);
	}
	// @ts-ignore
	if (teamData.length > 0) {
		// @ts-ignore
		output['Teams'] = teamData.map((i) => i.data);
	}
	// @ts-ignore
	if (placingData.length > 0) {
		// @ts-ignore
		output['Placings'] = placingData.map((i) => i.data);
	}
	// @ts-ignore
	if (penaltyData.length > 0) {
		// @ts-ignore
		output['Penalties'] = penaltyData.map((i) => i.data);
	}
	if (histogramData) {
		// @ts-ignore
		output['Histograms'] = histogramData.data;
	}
	return output;
}

export async function getAllResults(ascending = true, limit = 0) {
	const initial = db
		.select()
		.from(results)
		.orderBy(ascending ? asc(results.duosmiumId) : desc(results.duosmiumId));
	if (limit === 0) {
		return await initial;
	} else {
		return await initial.limit(limit);
	}
}

export async function getAllCompleteResults(ascending = true, limit = 0) {
	const output = {};
	for (const result of await getAllResults(ascending, limit)) {
		const duosmiumID = result.duosmiumId;
		// @ts-ignore
		output[duosmiumID] = await getCompleteResult(duosmiumID);
	}
	return output;
}

export async function resultExists(duosmiumID: string) {
	return (
		(
			await db
				.select({ count: sql<number>`count(*)` })
				.from(results)
				.where(eq(results.duosmiumId, duosmiumID))
		)[0].count > 0
	);
}

export async function deleteResult(duosmiumID: string) {
	return (await db.delete(results).where(eq(results.duosmiumId, duosmiumID)).returning())[0];
}

export async function deleteAllResults() {
	return await db.delete(results).returning();
}

export async function addResultFromYAMLFile(
	file: File,
	callback = function (name: string) {
		const q = ResultsAddQueue.getInstance();
		console.log(
			`Result ${name} added! There are ${q.running()} workers running. The queue length is ${q.length()}.`
		);
	}
) {
	const yaml = await file.text();
	// @ts-ignore
	const obj: object = load(yaml);
	const interpreter: Interpreter = getInterpreter(obj);
	// console.log(resultData);
	try {
		await keepTryingUntilItWorks(addCompleteResult, interpreter);
		// await addCompleteResult(interpreter);
		callback(generateFilename(interpreter));
	} catch (e) {
		console.log(`ERROR: could not add ${generateFilename(interpreter)}!`);
		console.log(e);
	}
}

export async function addResult(resultData: object, tx = db) {
	return await tx
		.insert(results)
		// @ts-ignore
		.values(resultData)
		.onConflictDoUpdate({ target: results.duosmiumId, set: resultData });
}

export async function createResultDataInput(interpreter: Interpreter) {
	const duosmiumID = generateFilename(interpreter);
	const logo = await createLogoPath(duosmiumID);
	const color = await createBgColorFromImagePath(logo);
	const title = tournamentTitle(interpreter.tournament);
	const fullTitle = fullTournamentTitle(interpreter.tournament);
	const shortTitle = tournamentTitleShort(interpreter.tournament);
	const fullShortTitle = fullTournamentTitleShort(interpreter.tournament);
	const date = dateString(interpreter);
	const locationName = interpreter.tournament.location;
	const locationState = interpreter.tournament.state;
	return {
		logo: logo,
		color: color,
		title: title,
		fullTitle: fullTitle,
		shortTitle: shortTitle,
		fullShortTitle: fullShortTitle,
		date: date,
		locationName: locationName,
		locationCity: '',
		locationState: locationState,
		locationCountry: 'United States',
		updatedAt: new Date(),
		duosmiumId: duosmiumID
	};
}

export async function regenerateMetadata(duosmiumID: string) {
	const input = await createResultDataInput(duosmiumID);
	return await db.update(results).set(input);
}

export async function regenerateAllMetadata() {
	const ids = (await db.select({ duosmiumId: results.duosmiumId }).from(results)).map(
		(result) => result.duosmiumId
	);
	const operation = db.transaction(async (tx) => {
		for (const id of ids) {
			const input = await createResultDataInput(getInterpreter(await getCompleteResult(id)));
			await addResult(input);
		}
	});
	return await operation;
}

export const cacheCompleteResult = cache(async (id: string) => {
	return await getCompleteResult(id);
});

export async function getRecentResults(ascending = true, limit = 0) {
	const initial = db
		.select()
		.from(results)
		.orderBy(
			desc(results.createdAt),
			ascending ? asc(results.duosmiumId) : desc(results.duosmiumId)
		);
	if (limit == 0) {
		return await initial;
	} else {
		return await initial.limit(limit);
	}
}

export async function addCompleteResult(interpreter: Interpreter) {
	const duosmiumID = generateFilename(interpreter);
	await db.transaction(async (tx) => {
		// Result
		await addResult(await createResultDataInput(interpreter), tx);
		// Tournament (and location)
		await tx.transaction(async (tx2) => {
			await addTournament(await createTournamentDataInput(interpreter.tournament, duosmiumID), tx2);
			await addLocation(
				await createLocationDataInput(
					interpreter.tournament.location,
					interpreter.tournament.state
				),
				tx2
			);
		});
		// Events
		for (const event of interpreter.events) {
			await addEvent(await createEventDataInput(event, duosmiumID), tx);
		}
		// Tracks
		for (const track of interpreter.tracks) {
			await addTrack(await createTrackDataInput(track, duosmiumID), tx);
		}
		// Teams (and locations)
		for (const team of interpreter.teams) {
			await tx.transaction(async (tx2) => {
				await addTeam(await createTeamDataInput(team, duosmiumID), tx2);
				await addLocation(
					await createLocationDataInput(
						team.school,
						team.state in STATES_BY_POSTAL_CODE ? team.state : '',
						team.city ?? '',
						team.state in STATES_BY_POSTAL_CODE ? 'United States' : team.state
					),
					tx2
				);
			});
		}
		// Placings
		for (const placing of interpreter.placings) {
			await addPlacing(await createPlacingDataInput(placing, duosmiumID), tx);
		}
		// Penalties
		for (const penalty of interpreter.penalties) {
			await addPenalty(await createPenaltyDataInput(penalty, duosmiumID), tx);
		}
		// Histogram
		if (interpreter.histograms) {
			await addHistogram(await createHistogramDataInput(interpreter.histograms, duosmiumID), tx);
		}
	});
}
