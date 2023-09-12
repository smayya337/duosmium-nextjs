import { db } from '@/lib/global/drizzle';
import { placings } from '@/lib/global/schema';
import { and, eq, sql } from 'drizzle-orm';
// @ts-ignore
import { Placing } from 'sciolyff/interpreter';

export async function getPlacing(duosmiumID: string, eventName: string, teamNumber: number) {
	return (
		await db
			.selectDistinct()
			.from(placings)
			.where(
				and(
					eq(placings.resultDuosmiumId, duosmiumID),
					eq(placings.eventName, eventName),
					eq(placings.teamNumber, teamNumber)
				)
			)
	)[0];
}

export async function getPlacingData(duosmiumID: string) {
	// noinspection TypeScriptValidateJSTypes
	const rawData = await db
		.select({ data: placings.data })
		.from(placings)
		.where(eq(placings.resultDuosmiumId, duosmiumID))
		.orderBy(placings.teamNumber, placings.eventName);
	return rawData.map((i) => i.data);
}

export async function placingExists(duosmiumID: string, eventName: string, teamNumber: number) {
	return (
		(
			await db
				.select({ count: sql<number>`count(*)` })
				.from(placings)
				.where(
					and(
						eq(placings.resultDuosmiumId, duosmiumID),
						eq(placings.eventName, eventName),
						eq(placings.teamNumber, teamNumber)
					)
				)
		)[0].count > 0
	);
}

export async function deletePlacing(duosmiumID: string, eventName: string, teamNumber: number) {
	return (
		await db
			.delete(placings)
			.where(
				and(
					eq(placings.resultDuosmiumId, duosmiumID),
					eq(placings.eventName, eventName),
					eq(placings.teamNumber, teamNumber)
				)
			)
			.returning()
	)[0];
}

export async function deleteAllPlacings() {
	// noinspection ES6RedundantAwait
	return await db.delete(placings).returning();
}

export async function addPlacing(placingData: object, tx = db) {
	return (
		(
			await tx
				.insert(placings)
				// @ts-ignore
				.values(placingData)
				.onConflictDoUpdate({
					target: [placings.resultDuosmiumId, placings.teamNumber, placings.eventName],
					set: placingData
				})
				.returning()
		)[0]
	);
}

export async function createPlacingDataInput(placing: Placing, duosmiumID: string) {
	return {
		eventName: placing.event.name,
		teamNumber: placing.team.number,
		resultDuosmiumId: duosmiumID,
		data: placing.rep
	};
}
