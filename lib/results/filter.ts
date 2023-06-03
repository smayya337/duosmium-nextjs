import { getAllPolicies } from '@/lib/auth/results';
import prisma from '@/lib/global/prisma';
import { getAllResults, getCompleteResult, getRecentResults } from '@/lib/results/async';

export async function getReadablePolicyRegex(userID: string | null) {
	return new RegExp(
		'^(' +
			(await getAllPolicies(userID))
				.filter((i) => i.read)
				.map((i) => `(${i.resultDuosmiumIdRegExp})`)
				.join('|') +
			')$'
	);
}

export async function getDeletablePolicyRegex(userID: string | null) {
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
	return (await getAllResults(ascending, 0))
		.filter((i) => i.duosmiumId.match(policyRegex))
		.slice(0, limit);
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

export async function getRecentReadableResults(userID: string | null, limit = 0) {
	const policyRegex = await getReadablePolicyRegex(userID);
	return (await getRecentResults(false, 0))
		.filter((i) => i.duosmiumId.match(policyRegex))
		.slice(0, limit);
}
