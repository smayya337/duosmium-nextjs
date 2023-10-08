// noinspection ES6RedundantAwait

import { db } from '@/lib/global/drizzle';
import { tournaments } from '@/lib/global/schema';
import { eq, sql } from 'drizzle-orm';
// @ts-ignore
import { Tournament } from 'sciolyff/interpreter';

export async function getTournament(duosmiumID: string) {
	return (
		await db.selectDistinct().from(tournaments).where(eq(tournaments.resultDuosmiumId, duosmiumID))
	)[0];
}

export async function getTournamentData(duosmiumID: string) {
	const rawData = (
		await db.select().from(tournaments).where(eq(tournaments.resultDuosmiumId, duosmiumID))
	)[0];
	if (rawData === null) {
		return null;
	} else {
		return rawData.data;
	}
}

export async function tournamentExists(duosmiumID: string) {
	return (
		(
			await db
				.select({ count: sql<number>`count(*)` })
				.from(tournaments)
				.where(eq(tournaments.resultDuosmiumId, duosmiumID))
		)[0].count > 0
	);
}

export async function deleteTournament(duosmiumID: string) {
	return (
		await db.delete(tournaments).where(eq(tournaments.resultDuosmiumId, duosmiumID)).returning()
	)[0];
}

export async function deleteAllTournaments() {
	return await db.delete(tournaments).returning();
}

export async function addTournament(tournamentData: object, tx = db) {
	return await tx
		.insert(tournaments)
		// @ts-ignore
		.values(tournamentData)
		.onConflictDoUpdate({ target: tournaments.resultDuosmiumId, set: tournamentData });
}

export async function createTournamentDataInput(tournament: Tournament, duosmiumID: string) {
	return {
		resultDuosmiumId: duosmiumID,
		data: sql`${tournament.rep}::jsonb`
	};
}

export async function getAllTournamentsByLevel(level: string) {
	// @ts-ignore
	return (await db.select().from(tournaments)).filter((t) => t.data.level === level);
}

export async function countAllTournamentsByLevel(level: string) {
	let output = 0;
	(await db.select().from(tournaments)).forEach((t) => {
		//  @ts-ignore
		if (t.data.level === level) {
			output += 1;
		}
	});
	return output;
}
