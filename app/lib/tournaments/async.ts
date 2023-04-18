// noinspection ES6RedundantAwait

// @ts-ignore
import { Tournament } from 'sciolyff/interpreter';
import { prisma } from '@/app/lib/global/prisma';

export async function getTournament(duosmiumID: string) {
	return await prisma.tournament.findUniqueOrThrow({
		where: {
			resultDuosmiumId: duosmiumID
		}
	});
}

export async function getTournamentData(duosmiumID: string) {
	const rawData = await prisma.tournament.findUnique({
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

export async function tournamentExists(duosmiumID: string) {
	return (
		(await prisma.tournament.count({
			where: {
				resultDuosmiumId: duosmiumID
			}
		})) > 0
	);
}

export async function deleteTournament(duosmiumID: string) {
	return await prisma.tournament.delete({
		where: {
			resultDuosmiumId: duosmiumID
		}
	});
}

export async function deleteAllTournaments() {
	return await prisma.tournament.deleteMany({});
}

export async function addTournament(tournamentData: object) {
	return await prisma.tournament.upsert({
		where: {
			// @ts-ignore
			resultDuosmiumId: tournamentData.resultDuosmiumId
		},
		// @ts-ignore
		create: tournamentData,
		update: tournamentData
	});
}

export async function createTournamentDataInput(tournament: Tournament) {
	return {
		data: tournament.rep
	};
}