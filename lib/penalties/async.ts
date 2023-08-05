// noinspection ES6RedundantAwait

import { db } from '@/lib/global/drizzle';
import { events, penalties } from '@/lib/global/schema';
import { and, eq, sql } from 'drizzle-orm';
// @ts-ignore
import { Penalty } from 'sciolyff/interpreter';

export async function getPenalty(duosmiumID: string, teamNumber: number) {
	return (
		await db
			.selectDistinct()
			.from(penalties)
			.where(and(eq(penalties.resultDuosmiumId, duosmiumID), eq(penalties.teamNumber, teamNumber)))
	)[0];
}

export async function getPenaltyData(duosmiumID: string) {
	const rawData = await db
		.select({ data: penalties.data })
		.from(events)
		.where(eq(penalties.resultDuosmiumId, duosmiumID))
		.orderBy(penalties.teamNumber);
	return rawData.map((i) => i.data);
}

export async function penaltyExists(duosmiumID: string, teamNumber: number) {
	return (
		(
			await db
				.select({ count: sql<number>`count(*)` })
				.from(penalties)
				.where(
					and(eq(penalties.resultDuosmiumId, duosmiumID), eq(penalties.teamNumber, teamNumber))
				)
		)[0].count > 0
	);
}

export async function deletePenalty(duosmiumID: string, teamNumber: number) {
	return (
		await db
			.delete(penalties)
			.where(and(eq(penalties.resultDuosmiumId, duosmiumID), eq(penalties.teamNumber, teamNumber)))
			.returning()
	)[0];
}

export async function deleteAllPenalties() {
	return await db.delete(penalties).returning();
}

export async function addPenalty(penaltyData: object) {
	return (
		(
			await db
				.insert(penalties)
				// @ts-ignore
				.values(penaltyData)
				.onConflictDoUpdate({
					target: [penalties.resultDuosmiumId, penalties.teamNumber],
					set: penaltyData
				})
				.returning()
		)[0]
	);
}

export async function createPenaltyDataInput(penalty: Penalty, duosmiumID: string) {
	return {
		resultDuosmiumId: duosmiumID,
		number: penalty.team.number,
		data: penalty.rep
	};
}
