// noinspection ES6RedundantAwait

// @ts-ignore
import { Histogram } from 'sciolyff/interpreter';
import { prisma } from '@/app/lib/global/prisma';

export async function getHistogram(duosmiumID: string) {
	return await prisma.histogram.findUniqueOrThrow({
		where: {
			resultDuosmiumId: duosmiumID
		}
	});
}

export async function getHistogramData(duosmiumID: string) {
	const rawData = await prisma.histogram.findUnique({
		where: {
			resultDuosmiumId: duosmiumID
		}
	});
	if (rawData === null) {
		return null;
	} else {
		return rawData.data;
	}
}

export async function histogramExists(duosmiumID: string) {
	return (
		(await prisma.histogram.count({
			where: {
				resultDuosmiumId: duosmiumID
			}
		})) > 0
	);
}

export async function deleteHistogram(duosmiumID: string) {
	return await prisma.histogram.delete({
		where: {
			resultDuosmiumId: duosmiumID
		}
	});
}

export async function deleteAllHistograms() {
	return await prisma.histogram.deleteMany({});
}

export async function addHistogram(histogramData: object) {
	return await prisma.histogram.upsert({
		where: {
			// @ts-ignore
			tournamentId: histogramData.tournament.connect.id
		},
		// @ts-ignore
		create: histogramData,
		update: histogramData
	});
}

export async function createHistogramDataInput(histogram: Histogram) {
	return {
		data: {
			connectOrCreate: histogram.rep
		}
	};
}
