// @ts-ignore

import { Placing } from 'sciolyff/interpreter';
import prisma from '@/lib/global/prisma';

export async function getPlacing(duosmiumID: string, eventName: string, teamNumber: number) {
	// noinspection ES6RedundantAwait
	return await prisma.placing.findUniqueOrThrow({
		where: {
			resultDuosmiumId_eventName_teamNumber: {
				resultDuosmiumId: duosmiumID,
				eventName: eventName,
				teamNumber: teamNumber
			}
		}
	});
}

export async function getPlacingData(duosmiumID: string) {
	// noinspection TypeScriptValidateJSTypes
	const rawData = await prisma.placing.findMany({
		where: {
			resultDuosmiumId: duosmiumID
		},
		orderBy: [
			{
				teamNumber: 'asc'
			},
			{
				eventName: 'asc'
			}
		]
	});
	return rawData.map((i) => i.data);
}

export async function placingExists(duosmiumID: string, eventName: string, teamNumber: number) {
	return (
		(await prisma.placing.count({
			where: {
				resultDuosmiumId: duosmiumID,
				eventName: eventName,
				teamNumber: teamNumber
			}
		})) > 0
	);
}

export async function deletePlacing(duosmiumID: string, eventName: string, teamNumber: number) {
	// noinspection ES6RedundantAwait
	return await prisma.placing.delete({
		where: {
			resultDuosmiumId_eventName_teamNumber: {
				resultDuosmiumId: duosmiumID,
				eventName: eventName,
				teamNumber: teamNumber
			}
		}
	});
}

export async function deleteAllPlacings() {
	// noinspection ES6RedundantAwait
	return await prisma.placing.deleteMany({});
}

export async function addPlacing(placingData: object) {
	// noinspection TypeScriptValidateJSTypes
	return prisma.placing.upsert({
		where: {
			resultDuosmiumId_eventName_teamNumber: {
				// @ts-ignore
				resultDuosmiumId: placingData.resultDuosmiumId,
				// @ts-ignore
				eventName: placingData.eventName,
				// @ts-ignore
				teamNumber: placingData.teamNumber
			}
		},
		// @ts-ignore
		create: placingData,
		update: placingData
	});
}

export async function createPlacingDataInput(placing: Placing, duosmiumID: string) {
	return {
		event: {
			connect: {
				resultDuosmiumId_name: {
					resultDuosmiumId: duosmiumID,
					name: placing.event.name
				}
			}
		},
		team: {
			connect: {
				resultDuosmiumId_number: {
					resultDuosmiumId: duosmiumID,
					number: placing.team.number
				}
			}
		},
		data: placing.rep
	};
}
