// noinspection ES6RedundantAwait

import { db } from '@/lib/global/drizzle';
import { tracks } from '@/lib/global/schema';
import { and, eq, sql } from 'drizzle-orm';
// @ts-ignore
import { Track } from 'sciolyff/interpreter';

export async function getTrack(duosmiumID: string, name: string) {
	return (
		await db
			.selectDistinct()
			.from(tracks)
			.where(and(eq(tracks.resultDuosmiumId, duosmiumID), eq(tracks.name, name)))
	)[0];
}

export async function getTrackData(duosmiumID: string) {
	const rawData = await db
		.select({ data: tracks.data })
		.from(tracks)
		.where(eq(tracks.resultDuosmiumId, duosmiumID))
		.orderBy(tracks.name);
	return rawData.map((i) => i.data);
}

export async function trackExists(duosmiumID: string, name: string) {
	return (
		(
			await db
				.select({ count: sql<number>`count(*)` })
				.from(tracks)
				.where(and(eq(tracks.resultDuosmiumId, duosmiumID), eq(tracks.name, name)))
		)[0].count > 0
	);
}

export async function deleteTrack(duosmiumID: string, name: string) {
	return (
		await db
			.delete(tracks)
			.where(and(eq(tracks.resultDuosmiumId, duosmiumID), eq(tracks.name, name)))
			.returning()
	)[0];
}

export async function deleteAllTracks() {
	return await db.delete(tracks).returning();
}

export async function addTrack(trackData: object, tx = db) {
	return (
		(
			await tx
				.insert(tracks)
				// @ts-ignore
				.values(trackData)
				.onConflictDoUpdate({ target: [tracks.resultDuosmiumId, tracks.name], set: trackData })
		)[0]
	);
}

export async function createTrackDataInput(track: Track, duosmiumID: string) {
	return {
		resultDuosmiumId: duosmiumID,
		name: track.name.toString(),
		data: track.rep
	};
}
