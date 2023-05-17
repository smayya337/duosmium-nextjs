// noinspection ES6RedundantAwait

// @ts-ignore
import { Penalty } from 'sciolyff/interpreter';
import { prisma } from '@/lib/global/prisma';

export async function getPenalty(duosmiumID: string, teamNumber: number) {
	return await prisma.penalty.findUniqueOrThrow({
		where: {
			resultDuosmiumId_teamNumber: {
				resultDuosmiumId: duosmiumID,
				teamNumber: teamNumber
			}
		}
	});
}

export async function getPenaltyData(duosmiumID: string) {
	const rawData = await prisma.penalty.findMany({
		where: {
			resultDuosmiumId: duosmiumID
		},
		orderBy: {
			teamNumber: 'asc'
		},
		select: {
			data: true
		}
	});
	return rawData.map((i) => i.data);
}

export async function penaltyExists(duosmiumID: string, teamNumber: number) {
	return (
		(await prisma.penalty.count({
			where: {
				resultDuosmiumId: duosmiumID,
				teamNumber: teamNumber
			}
		})) > 0
	);
}

export async function deletePenalty(duosmiumID: string, teamNumber: number) {
	return await prisma.penalty.delete({
		where: {
			resultDuosmiumId_teamNumber: {
				resultDuosmiumId: duosmiumID,
				teamNumber: teamNumber
			}
		}
	});
}

export async function deleteAllPenalties() {
	return await prisma.penalty.deleteMany({});
}

export async function addPenalty(penaltyData: object) {
	return await prisma.penalty.upsert({
		where: {
			resultDuosmiumId_teamNumber: {
				// @ts-ignore
				resultDuosmiumId: penaltyData.resultDuosmiumId,
				// @ts-ignore
				teamNumber: penaltyData.teamNumber
			}
		},
		// @ts-ignore
		create: penaltyData,
		update: penaltyData
	});
}

export async function createPenaltyDataInput(penalty: Penalty, duosmiumID: string) {
	return {
		team: {
			connect: {
				resultDuosmiumId_number: {
					resultDuosmiumId: duosmiumID,
					number: penalty.team.number
				}
			}
		},
		data: penalty.rep
	};
}
