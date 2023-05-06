// noinspection ES6RedundantAwait

// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { findBgColor, findLogoPath, generateFilename } from './helpers';
import { load } from 'js-yaml';
import { getInterpreter } from './interpreter';
import { keepTryingUntilItWorks, prisma } from '@/app/lib/global/prisma';
import { createTournamentDataInput, getTournamentData } from '@/app/lib/tournaments/async';
import { createHistogramDataInput, getHistogramData } from '@/app/lib/histograms/async';
import { ResultsAddQueue } from './queue';
import { createTeamDataInput, getTeamData } from '@/app/lib/teams/async';
import { createEventDataInput, getEventData } from '@/app/lib/events/async';
import { createPlacingDataInput, getPlacingData } from '@/app/lib/placings/async';
import { createPenaltyDataInput, getPenaltyData } from '@/app/lib/penalties/async';
import { createTrackDataInput, getTrackData } from '@/app/lib/tracks/async';
import { supabase } from '@/app/lib/global/supabase';
import { NextResponse } from 'next/server';

export const RESULT_TABLE = 'Result';

export async function getResult(duosmiumID: string, client = supabase) {
	const { data, error } = await client.from(RESULT_TABLE).select().eq('duosmiumId', duosmiumID);
	if (error) {
		throw error;
	}
	if (!data) {
		throw new Error('No result found!');
	}
	return data[0];
	// return await prisma.result.findUniqueOrThrow({
	// 	where: {
	// 		duosmiumId: duosmiumID
	// 	}
	// });
}

export async function getCompleteResult(duosmiumID: string) {
	const tournamentData = await getTournamentData(duosmiumID);
	const eventData = await getEventData(duosmiumID);
	const trackData = await getTrackData(duosmiumID);
	const teamData = await getTeamData(duosmiumID);
	const placingData = await getPlacingData(duosmiumID);
	const penaltyData = await getPenaltyData(duosmiumID);
	const histogramData = await getHistogramData(duosmiumID);
	const output = {};
	if (tournamentData !== null) {
		// @ts-ignore
		output['Tournament'] = tournamentData;
	}
	if (eventData.length > 0) {
		// @ts-ignore
		output['Events'] = eventData;
	}
	if (trackData.length > 0) {
		// @ts-ignore
		output['Tracks'] = trackData;
	}
	if (teamData.length > 0) {
		// @ts-ignore
		output['Teams'] = teamData;
	}
	if (placingData.length > 0) {
		// @ts-ignore
		output['Placings'] = placingData;
	}
	if (penaltyData.length > 0) {
		// @ts-ignore
		output['Penalties'] = penaltyData;
	}
	if (histogramData !== null) {
		// @ts-ignore
		output['Histograms'] = histogramData;
	}
	return output;
}

export async function getAllResults() {
	return await prisma.result.findMany({
		orderBy: [
			{
				duosmiumId: 'asc'
			}
		]
	});
}

export async function getAllResultsMostRecent(client = supabase, limit = 24) {
	const { data, error } = await client
		.from(RESULT_TABLE)
		.select('*')
		.order('duosmiumId', { ascending: false })
		.limit(limit);
	if (error) {
		throw error;
	}
	return data;
}

export async function getAllCompleteResults() {
	const output = {};
	for (const result of await getAllResults()) {
		const duosmiumID = result.duosmiumId;
		// @ts-ignore
		output[duosmiumID] = await getCompleteResult(duosmiumID);
	}
	return output;
}

export async function resultExists(duosmiumID: string, client = supabase) {
	const { data, error } = await client
		.from(RESULT_TABLE)
		.select('*', { head: true, count: 'exact' })
		.eq('duosmiumId', duosmiumID);
	if (error) {
		throw error;
	}
	return data?.length > 0;
}

export async function deleteResult(duosmiumID: string, client = supabase) {
	// return await prisma.result.delete({
	// 	where: {
	// 		duosmiumId: duosmiumID
	// 	}
	// });
	const { error } = await client.from(RESULT_TABLE).delete().eq('duosmiumId', duosmiumID);
	if (error) {
		throw error;
	}
}

export async function deleteAllResults() {
	return await prisma.result.deleteMany({});
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
}

export async function addResult(resultData: object) {
	return await prisma.result.upsert({
		where: {
			// @ts-ignore
			duosmiumId: resultData['duosmiumId']
		},
		// @ts-ignore
		create: resultData,
		update: resultData
	});
}

export async function createResultDataInput(interpreter: Interpreter) {
	const duosmiumID = generateFilename(interpreter);
	const tournamentData = await createTournamentDataInput(interpreter.tournament);
	const tournament = interpreter.tournament;
	const eventData = [];
	for (const event of tournament.events) {
		const thisEventData = await createEventDataInput(event);
		eventData.push({
			create: thisEventData,
			where: {
				resultDuosmiumId_name: {
					resultDuosmiumId: duosmiumID,
					name: event.name
				}
			}
		});
	}
	const trackData = [];
	for (const track of tournament.tracks) {
		const thisTrackData = await createTrackDataInput(track);
		trackData.push({
			create: thisTrackData,
			where: {
				resultDuosmiumId_name: {
					resultDuosmiumId: duosmiumID,
					name: track.name.toString()
				}
			}
		});
	}
	const teamData = [];
	for (const team of tournament.teams) {
		const thisTeamData = await createTeamDataInput(team);
		teamData.push({
			create: thisTeamData,
			where: {
				resultDuosmiumId_number: {
					resultDuosmiumId: duosmiumID,
					number: team.number
				}
			}
		});
	}
	const placingData = [];
	for (const placing of tournament.placings) {
		const thisPlacingData = await createPlacingDataInput(placing, duosmiumID);
		placingData.push({
			create: thisPlacingData,
			where: {
				resultDuosmiumId_eventName_teamNumber: {
					resultDuosmiumId: duosmiumID,
					eventName: placing.event.name,
					teamNumber: placing.team.number
				}
			}
		});
	}
	const penaltyData = [];
	for (const penalty of tournament.penalties) {
		const thisPenaltyData = await createPenaltyDataInput(penalty, duosmiumID);
		penaltyData.push({
			create: thisPenaltyData,
			where: {
				resultDuosmiumId_teamNumber: {
					resultDuosmiumId: duosmiumID,
					teamNumber: penalty.team.number
				}
			}
		});
	}
	const output = {
		duosmiumId: duosmiumID,
		tournament: {
			connectOrCreate: {
				create: tournamentData,
				where: {
					resultDuosmiumId: duosmiumID
				}
			}
		},
		events: {
			connectOrCreate: eventData
		},
		tracks: {
			connectOrCreate: trackData
		},
		teams: {
			connectOrCreate: teamData
		},
		placings: {
			connectOrCreate: placingData
		},
		penalties: {
			connectOrCreate: penaltyData
		},
		logo: await findLogoPath(duosmiumID),
		color: await findBgColor(duosmiumID)
	};
	if (interpreter.histograms) {
		// @ts-ignore
		output['histogram'] = {
			connectOrCreate: {
				create: await createHistogramDataInput(interpreter.histograms),
				where: {
					resultDuosmiumId: duosmiumID
				}
			}
		};
	}
	return output;
}
