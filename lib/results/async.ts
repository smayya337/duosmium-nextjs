// noinspection ES6RedundantAwait

import { createEventDataInput } from '@/lib/events/async';
import prisma, { keepTryingUntilItWorks } from '@/lib/global/prisma';
import { createHistogramDataInput } from '@/lib/histograms/async';
import { createLocationDataInput } from '@/lib/locations/async';
import { createPenaltyDataInput } from '@/lib/penalties/async';
import { createPlacingDataInput } from '@/lib/placings/async';
import { createBgColorFromImagePath, findBgColor } from '@/lib/results/color';
import { createLogoPath, findLogoPath } from '@/lib/results/logo';
import { createTeamDataInput } from '@/lib/teams/async';
import { createTournamentDataInput } from '@/lib/tournaments/async';
import { createTrackDataInput } from '@/lib/tracks/async';
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
	return await prisma.result.findUniqueOrThrow({
		where: {
			duosmiumId: duosmiumID
		}
	});
}

async function getCompleteResultData(duosmiumID: string) {
	const [tournamentData, eventData, trackData, teamData, placingData, penaltyData, histogramData] =
		await prisma.$transaction([
			prisma.tournament.findUnique({
				where: {
					resultDuosmiumId: duosmiumID
				},
				select: {
					data: true
				}
			}),
			prisma.event.findMany({
				where: {
					resultDuosmiumId: duosmiumID
				},
				select: {
					data: true
				},
				orderBy: {
					name: 'asc'
				}
			}),
			prisma.track.findMany({
				where: {
					resultDuosmiumId: duosmiumID
				},
				select: {
					data: true
				},
				orderBy: {
					name: 'asc'
				}
			}),
			prisma.team.findMany({
				where: {
					resultDuosmiumId: duosmiumID
				},
				orderBy: {
					number: 'asc'
				},
				select: {
					data: true
				}
			}),
			prisma.placing.findMany({
				where: {
					resultDuosmiumId: duosmiumID
				},
				orderBy: [
					{
						teamNumber: 'asc'
					},
					{
						eventName: 'asc'
					}
				],
				select: {
					data: true
				}
			}),
			prisma.penalty.findMany({
				where: {
					resultDuosmiumId: duosmiumID
				},
				orderBy: {
					teamNumber: 'asc'
				},
				select: {
					data: true
				}
			}),
			prisma.histogram.findUnique({
				where: {
					resultDuosmiumId: duosmiumID
				},
				select: {
					data: true
				}
			})
		]);
	return [tournamentData, eventData, trackData, teamData, placingData, penaltyData, histogramData];
}

export async function getCompleteResult(duosmiumID: string) {
	// @ts-ignore
	const [tournamentData, eventData, trackData, teamData, placingData, penaltyData, histogramData] =
		await getCompleteResultData(duosmiumID);
	const output = {};
	if (tournamentData !== null) {
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
	if (histogramData !== null) {
		// @ts-ignore
		output['Histograms'] = histogramData.data;
	}
	return output;
}

export async function getAllResults(ascending = true, limit = 0) {
	return await prisma.result.findMany({
		orderBy: [
			{
				duosmiumId: ascending ? 'asc' : 'desc'
			}
		],
		take: limit === 0 ? undefined : limit
	});
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
		(await prisma.result.count({
			where: {
				duosmiumId: duosmiumID
			}
		})) > 0
	);
}

export async function deleteResult(duosmiumID: string) {
	return await prisma.result.delete({
		where: {
			duosmiumId: duosmiumID
		}
	});
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
	const locationName = tournament.location;
	const locationState = tournament.state;
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
		color: await findBgColor(duosmiumID),
		title: tournamentTitle(interpreter.tournament),
		fullTitle: fullTournamentTitle(interpreter.tournament),
		shortTitle: tournamentTitleShort(interpreter.tournament),
		fullShortTitle: fullTournamentTitleShort(interpreter.tournament),
		date: dateString(interpreter),
		location: await createLocationDataInput(locationName, locationState)
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

export async function regenerateMetadata(duosmiumID: string) {
	const interpreter = getInterpreter(await getCompleteResult(duosmiumID));
	const logo = await createLogoPath(duosmiumID);
	const color = await createBgColorFromImagePath(duosmiumID);
	const title = tournamentTitle(interpreter.tournament);
	const fullTitle = fullTournamentTitle(interpreter.tournament);
	const shortTitle = tournamentTitleShort(interpreter.tournament);
	const fullShortTitle = fullTournamentTitleShort(interpreter.tournament);
	const date = dateString(interpreter);
	const locationName = interpreter.tournament.location;
	const locationState = interpreter.tournament.state;
	return await prisma.result.update({
		where: {
			duosmiumId: duosmiumID
		},
		data: {
			logo: logo,
			color: color,
			title: title,
			fullTitle: fullTitle,
			shortTitle: shortTitle,
			fullShortTitle: fullShortTitle,
			date: date,
			location: await createLocationDataInput(locationName, locationState)
		}
	});
}

export async function regenerateAllMetadata() {
	const ids = (
		await prisma.result.findMany({
			select: {
				duosmiumId: true
			}
		})
	).map((result) => result.duosmiumId);
	const operation = [];
	for (const id of ids) {
		const interpreter = getInterpreter(await getCompleteResult(id));
		const logoPath = await createLogoPath(id);
		const bgColor = await createBgColorFromImagePath(logoPath);
		const title = tournamentTitle(interpreter.tournament);
		const fullTitle = fullTournamentTitle(interpreter.tournament);
		const shortTitle = tournamentTitleShort(interpreter.tournament);
		const fullShortTitle = fullTournamentTitleShort(interpreter.tournament);
		const date = dateString(interpreter);
		const locationName = interpreter.tournament.location;
		const locationState = interpreter.tournament.state;
		operation.push(
			prisma.result.update({
				where: {
					duosmiumId: id
				},
				data: {
					logo: logoPath,
					color: bgColor,
					title: title,
					fullTitle: fullTitle,
					shortTitle: shortTitle,
					fullShortTitle: fullShortTitle,
					date: date,
					location: await createLocationDataInput(locationName, locationState)
				}
			})
		);
	}
	return prisma.$transaction(operation);
}

export const cacheCompleteResult = cache(async (id: string) => {
	return await getCompleteResult(id);
});

export async function getRecentResults(ascending = true, limit = 0) {
	return await prisma.result.findMany({
		orderBy: [
			{
				createdAt: 'desc'
			},
			{
				duosmiumId: ascending ? 'asc' : 'desc'
			}
		],
		take: limit === 0 ? undefined : limit
	});
}
