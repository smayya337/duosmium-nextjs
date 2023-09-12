// noinspection ES6RedundantAwait

import { db } from '@/lib/global/drizzle';
import { histograms } from '@/lib/global/schema';
import { eq, sql } from 'drizzle-orm';
// @ts-ignore
import { Histogram } from 'sciolyff/interpreter';

export async function getHistogram(duosmiumID: string) {
	return (
		await db.selectDistinct().from(histograms).where(eq(histograms.resultDuosmiumId, duosmiumID))
	)[0];
}

export async function getHistogramData(duosmiumID: string) {
	const rawData = (
		await db.select().from(histograms).where(eq(histograms.resultDuosmiumId, duosmiumID))
	)[0];
	if (rawData === null) {
		return null;
	} else {
		return rawData.data;
	}
}

export async function histogramExists(duosmiumID: string) {
	return (
		(
			await db
				.select({ count: sql<number>`count(*)` })
				.from(histograms)
				.where(eq(histograms.resultDuosmiumId, duosmiumID))
		)[0].count > 0
	);
}

export async function deleteHistogram(duosmiumID: string) {
	return (
		await db.delete(histograms).where(eq(histograms.resultDuosmiumId, duosmiumID)).returning()
	)[0];
}

export async function deleteAllHistograms() {
	return await db.delete(histograms).returning();
}

export async function addHistogram(histogramData: object, tx=db) {
	return await tx
		.insert(histograms)
		// @ts-ignore
		.values(histogramData)
		.onConflictDoUpdate({ target: histograms.resultDuosmiumId, set: histogramData });
}

export async function createHistogramDataInput(histogram: Histogram, duosmiumID: string) {
	return {
		resultDuosmiumId: duosmiumID,
		data: histogram.rep
	};
}
