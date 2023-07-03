// noinspection ES6RedundantAwait

import { STATES_BY_POSTAL_CODE } from '@/lib/global/helpers';
import prisma from '@/lib/global/prisma';
import { createLocationDataInput } from '@/lib/locations/async';
import { getAllCompleteResults } from '@/lib/results/async';
import { getInterpreter } from '@/lib/results/interpreter';
import { Location } from '@prisma/client';
// @ts-ignore
import Interpreter, { Team } from 'sciolyff/interpreter';

export async function getTeam(duosmiumID: string, number: number) {
	return await prisma.team.findUniqueOrThrow({
		where: {
			resultDuosmiumId_number: {
				resultDuosmiumId: duosmiumID,
				number: number
			}
		}
	});
}

export async function getTeamData(duosmiumID: string) {
	const rawData = await prisma.team.findMany({
		where: {
			resultDuosmiumId: duosmiumID
		},
		orderBy: {
			number: 'asc'
		},
		select: {
			data: true
		}
	});
	return rawData.map((i) => i.data);
}

export async function teamExists(duosmiumID: string, number: number) {
	return (
		(await prisma.team.count({
			where: {
				resultDuosmiumId: duosmiumID,
				number: number
			}
		})) > 0
	);
}

export async function deleteTeam(duosmiumID: string, number: number) {
	return await prisma.team.delete({
		where: {
			resultDuosmiumId_number: {
				resultDuosmiumId: duosmiumID,
				number: number
			}
		}
	});
}

export async function deleteAllTeams() {
	return await prisma.team.deleteMany({});
}

export async function addTeam(teamData: object) {
	return await prisma.team.upsert({
		where: {
			resultDuosmiumId_number: {
				// @ts-ignore
				resultDuosmiumId: teamData.resultDuosmiumId,
				// @ts-ignore
				number: teamData.number
			}
		},
		// @ts-ignore
		create: teamData,
		// @ts-ignore
		update: teamData
	});
}

export async function createTeamDataInput(team: Team) {
	const locationName = team.school;
	const locationCity = team.city ?? '';
	const locationState = team.state in STATES_BY_POSTAL_CODE ? team.state : '';
	const locationCountry = team.state in STATES_BY_POSTAL_CODE ? 'United States' : team.state;
	return {
		number: team.number,
		data: team.rep,
		location: await createLocationDataInput(
			locationName,
			locationState,
			locationCity,
			locationCountry
		)
	};
}

export async function getTeamBySchool() {}

export async function getAllTeamsBySchool() {
	return (
		await prisma.location.findMany({
			include: {
				teams: {
					orderBy: {
						resultDuosmiumId: 'desc'
					}
				}
			},
			orderBy: {
				name: 'asc'
			}
		})
	).filter((r) => r.teams.length > 0);
}

export async function getAllSchoolsAndRanks() {
	const completeResults = await getAllCompleteResults(false);
	const interpreters: Map<string, Interpreter> = new Map();
	const ranks: Map<string, Map<number, number>> = new Map();
	for (const res in completeResults) {
		// @ts-ignore
		const interpreter = getInterpreter(completeResults[res]);
		interpreters.set(res, interpreter);
		const rankMap: Map<number, number> = new Map();
		interpreter.teams.forEach((t: Team) => rankMap.set(t.number, t.rank));
		ranks.set(res, rankMap);
	}
	const allTeams = await getAllTeamsBySchool();
	const output: Map<Location, Map<string, number[]>> = new Map();
	for (const t of allTeams) {
		const loc: Location = {
			name: t.name,
			city: t.city,
			state: t.state,
			country: t.country
		};
		const rankMap: Map<string, number[]> = new Map();
		for (const tm of t.teams) {
			const rank = ranks.get(tm.resultDuosmiumId)?.get(tm.number);
			if (!rankMap.has(tm.resultDuosmiumId)) {
				rankMap.set(tm.resultDuosmiumId, []);
			}
			if (rank != null) {
				rankMap.get(tm.resultDuosmiumId)?.push(rank);
			}
		}
		for (const e of rankMap.entries()) {
			rankMap.set(e[0], e[1].sort());
		}
		output.set(loc, rankMap);
	}
	return output;
}
