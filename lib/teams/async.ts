// noinspection ES6RedundantAwait

import { db } from '@/lib/global/drizzle';
import { STATES_BY_POSTAL_CODE } from '@/lib/global/helpers';
import { teams } from '@/lib/global/schema';
import { getAllCompleteResults } from '@/lib/results/async';
import { getInterpreter } from '@/lib/results/interpreter';
import { Location } from '@prisma/client';
import { and, eq, sql } from 'drizzle-orm';
// @ts-ignore
import Interpreter, { Team } from 'sciolyff/interpreter';

export async function getTeam(duosmiumID: string, number: number) {
	return (
		await db
			.selectDistinct()
			.from(teams)
			.where(and(eq(teams.resultDuosmiumId, duosmiumID), eq(teams.number, number)))
	)[0];
}

export async function getTeamData(duosmiumID: string) {
	const rawData = await db
		.select({ data: teams.data })
		.from(teams)
		.where(eq(teams.resultDuosmiumId, duosmiumID))
		.orderBy(teams.number);
	return rawData.map((i) => i.data);
}

export async function teamExists(duosmiumID: string, number: number) {
	return (
		(
			await db
				.select({ count: sql<number>`count(*)` })
				.from(teams)
				.where(and(eq(teams.resultDuosmiumId, duosmiumID), eq(teams.number, number)))
		)[0].count > 0
	);
}

export async function deleteTeam(duosmiumID: string, number: number) {
	return (
		await db
			.delete(teams)
			.where(and(eq(teams.resultDuosmiumId, duosmiumID), eq(teams.number, number)))
			.returning()
	)[0];
}

export async function deleteAllTeams() {
	return await db.delete(teams).returning();
}

export async function addTeam(teamData: object) {
	return (
		(
			await db
				.insert(teams)
				// @ts-ignore
				.values(teamData)
				.onConflictDoUpdate({ target: [teams.resultDuosmiumId, teams.number], set: teamData })
				.returning()
		)[0]
	);
}

export async function createTeamDataInput(team: Team, duosmiumID: string) {
	const locationName = team.school;
	const locationCity = team.city ?? '';
	const locationState = team.state in STATES_BY_POSTAL_CODE ? team.state : '';
	const locationCountry = team.state in STATES_BY_POSTAL_CODE ? 'United States' : team.state;
	return {
		resultDuosmiumId: duosmiumID,
		number: team.number,
		data: team.rep,
		locationName: locationName,
		locationCity: locationCity,
		locationState: locationState,
		locationCountry: locationCountry
	};
}

export async function getTeamBySchool() {}

export async function getAllTeamsBySchool() {
	return (
		await db.query.locations.findMany({
			with: {
				teams: true
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
