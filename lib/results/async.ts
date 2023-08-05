// noinspection ES6RedundantAwait

import { db } from '@/lib/global/drizzle';
import { keepTryingUntilItWorks } from '@/lib/global/prisma';
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
import { createBgColorFromImagePath } from '@/lib/results/color';
import { createLogoPath } from '@/lib/results/logo';
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
	const resultData: object = await createResultDataInput(interpreter);
	// console.log(resultData);
	try {
		await keepTryingUntilItWorks(addResult, resultData);
		// await addResult(resultData);
		callback(generateFilename(interpreter));
	} catch (e) {
		console.log(`ERROR: could not add ${generateFilename(interpreter)}!`);
		console.log(e);
	}
	// TODO: can we just use addResult() instead of the cursed one?
}

export async function addResult(resultData: object) {
	return await db
		.insert(results)
		// @ts-ignore
		.values(results)
		.onConflictDoUpdate({ target: results.duosmiumId, set: resultData });
}

export async function createResultDataInput(interpreter: Interpreter) {
	const duosmiumID = generateFilename(interpreter);
	const logo = await createLogoPath(duosmiumID);
	const color = await createBgColorFromImagePath(duosmiumID);
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
		locationCountry: 'United States'
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
			const input = await createResultDataInput(id);
			await db.update(results).set(input);
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
