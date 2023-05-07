// noinspection ES6RedundantAwait

// @ts-ignore
import { Team } from 'sciolyff/interpreter';
import { prisma } from '@/app/lib/global/prisma';

export async function getTeam(duosmiumID: string, number: number) {
	return await prisma.team.findUniqueOrThrow({
		where: {
			resultDuosmiumId_number: {
				resultDuosmiumId: duosmiumID,
				number: number
			}
		}
	});
}

export async function getTeamData(duosmiumID: string) {
	const rawData = await prisma.team.findMany({
		where: {
			resultDuosmiumId: duosmiumID
		},
		orderBy: {
			number: 'asc'
		},
		select: {
			data: true
		}
	});
	return rawData.map((i) => i.data);
}

export async function teamExists(duosmiumID: string, number: number) {
	return (
		(await prisma.team.count({
			where: {
				resultDuosmiumId: duosmiumID,
				number: number
			}
		})) > 0
	);
}

export async function deleteTeam(duosmiumID: string, number: number) {
	return await prisma.team.delete({
		where: {
			resultDuosmiumId_number: {
				resultDuosmiumId: duosmiumID,
				number: number
			}
		}
	});
}

export async function deleteAllTeams() {
	return await prisma.team.deleteMany({});
}

export async function addTeam(teamData: object) {
	return await prisma.team.upsert({
		where: {
			resultDuosmiumId_number: {
				// @ts-ignore
				resultDuosmiumId: teamData.resultDuosmiumId,
				// @ts-ignore
				number: teamData.number
			}
		},
		// @ts-ignore
		create: teamData,
		// @ts-ignore
		update: teamData
	});
}

export async function createTeamDataInput(team: Team) {
	return {
		number: team.number,
		data: team.rep
	};
}
