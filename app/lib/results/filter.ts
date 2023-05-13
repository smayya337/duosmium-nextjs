import { getAllPolicies } from '@/app/lib/auth/results';
import { getAllResults, getCompleteResult } from '@/app/lib/results/async';
import { prisma } from '@/app/lib/global/prisma';

async function getReadablePolicyRegex(userID: string | null) {
	return new RegExp(
		'^(' +
			(await getAllPolicies(userID))
				.filter((i) => i.read)
				.map((i) => `(${i.resultDuosmiumIdRegExp})`)
				.join('|') +
			')$'
	);
}

async function getDeletablePolicyRegex(userID: string | null) {
	return new RegExp(
		'^(' +
			(await getAllPolicies(userID))
				.filter((i) => i.delete)
				.map((i) => `(${i.resultDuosmiumIdRegExp})`)
				.join('|') +
			')$'
	);
}

export async function getAllReadableResults(userID: string | null, ascending = true, limit = 0) {
	const policyRegex = await getReadablePolicyRegex(userID);
	return (await getAllResults(ascending, limit)).filter((i) => i.duosmiumId.match(policyRegex));
}

export async function getAllReadableCompleteResults(userID: string | null) {
	const output = {};
	for (const duosmiumID of (await getAllReadableResults(userID)).map((i) => i.duosmiumId)) {
		// @ts-ignore
		output[duosmiumID] = await getCompleteResult(duosmiumID);
	}
	return output;
}

export async function getAllDeletableResults(userID: string | null, ascending = true, limit = 0) {
	const policyRegex = await getDeletablePolicyRegex(userID);
	return (await getAllResults(ascending, limit)).filter((i) => i.duosmiumId.match(policyRegex));
}

export async function deleteAllDeletableResults(userID: string | null) {
	const deletableResults = (await getAllDeletableResults(userID))
		.map((i) => i.duosmiumId)
		.map((i) =>
			prisma.result.delete({
				where: {
					duosmiumId: i
				}
			})
		);
	return await prisma.$transaction(deletableResults);
}
