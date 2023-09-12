// noinspection ES6RedundantAwait

import { db } from '@/lib/global/drizzle';
import { events } from '@/lib/global/schema';
import { and, eq, sql } from 'drizzle-orm';
// @ts-ignore
import { Event } from 'sciolyff/interpreter';

export async function getEvent(duosmiumID: string, eventName: string) {
	return (
		await db
			.selectDistinct()
			.from(events)
			.where(and(eq(events.resultDuosmiumId, duosmiumID), eq(events.name, eventName)))
	)[0];
}

export async function getEventData(duosmiumID: string) {
	const rawData = await db
		.select({ data: events.data })
		.from(events)
		.where(eq(events.resultDuosmiumId, duosmiumID))
		.orderBy(events.name);
	return rawData.map((i) => i.data);
}

export async function eventExists(duosmiumID: string, eventName: string) {
	return (
		(
			await db
				.select({ count: sql<number>`count(*)` })
				.from(events)
				.where(and(eq(events.resultDuosmiumId, duosmiumID), eq(events.name, eventName)))
		)[0].count > 0
	);
}

export async function deleteEvent(duosmiumID: string, eventName: string) {
	return (
		await db
			.delete(events)
			.where(and(eq(events.resultDuosmiumId, duosmiumID), eq(events.name, eventName)))
			.returning()
	)[0];
}

export async function deleteAllEvents() {
	return await db.delete(events).returning();
}

export async function addEvent(resultEventData: object, tx=db) {
	return (
		(
			await tx
				.insert(events)
				// @ts-ignore
				.values(resultEventData)
				.onConflictDoUpdate({
					target: [events.resultDuosmiumId, events.name],
					set: resultEventData
				})
				.returning()
		)[0]
	);
}

export async function createEventDataInput(event: Event, duosmiumID: string) {
	return {
		resultDuosmiumId: duosmiumID,
		name: event.name,
		data: event.rep
	};
}
