import { prisma } from '@/lib/global/prisma';

export async function getMemberships(userID: string | null) {
	if (userID === null) {
		return ['public'];
	} else {
		return (
			await prisma.membership.findMany({
				where: {
					userId: userID
				},
				select: {
					organizationId: true
				}
			})
		).map((i) => i.organizationId);
	}
}

export async function getAllPolicies(userID: string | null) {
	let memberships = ['public'];
	let userPolicies: {
			resultDuosmiumIdRegExp: string;
			create: boolean;
			read: boolean;
			update: boolean;
			delete: boolean;
			createApproval: boolean;
			updateApproval: boolean;
			deleteApproval: boolean;
		}[],
		organizationPolicies;
	if (userID === null) {
		userPolicies = [];
		organizationPolicies = await prisma.organizationResultPolicy.findMany({
			where: {
				organization: {
					orgName: 'public'
				}
			},
			select: {
				resultDuosmiumIdRegExp: true,
				create: true,
				read: true,
				update: true,
				delete: true,
				createApproval: true,
				updateApproval: true,
				deleteApproval: true
			}
		});
	} else {
		memberships = (
			await prisma.membership.findMany({
				where: {
					userId: userID
				},
				select: {
					organizationId: true
				}
			})
		).map((i) => i.organizationId);
		const pols = await prisma.$transaction([
			prisma.userResultPolicy.findMany({
				where: {
					userId: userID
				},
				select: {
					resultDuosmiumIdRegExp: true,
					create: true,
					read: true,
					update: true,
					delete: true,
					createApproval: true,
					updateApproval: true,
					deleteApproval: true
				}
			}),
			prisma.organizationResultPolicy.findMany({
				where: {
					organizationId: {
						in: memberships
					}
				},
				select: {
					resultDuosmiumIdRegExp: true,
					create: true,
					read: true,
					update: true,
					delete: true,
					createApproval: true,
					updateApproval: true,
					deleteApproval: true
				}
			})
		]);
		userPolicies = pols[0];
		organizationPolicies = pols[1];
	}
	let allPolicies: {
		resultDuosmiumIdRegExp: string;
		create: boolean;
		read: boolean;
		update: boolean;
		delete: boolean;
		createApproval: boolean;
		updateApproval: boolean;
		deleteApproval: boolean;
	}[] = [];
	const regexps: string[] = [];
	// TODO: extract method
	for (const policy of userPolicies) {
		const match = regexps.indexOf(policy.resultDuosmiumIdRegExp);
		if (match > -1) {
			for (const prop of [
				'create',
				'read',
				'update',
				'delete',
				'createApproval',
				'updateApproval',
				'deleteApproval'
			]) {
				// @ts-ignore
				allPolicies[match][prop] = allPolicies[match][prop] || policy[prop];
			}
		} else {
			allPolicies.push(policy);
			regexps.push(policy.resultDuosmiumIdRegExp);
		}
	}
	for (const policy of organizationPolicies) {
		const match = regexps.indexOf(policy.resultDuosmiumIdRegExp);
		if (match > -1) {
			for (const prop of [
				'create',
				'read',
				'update',
				'delete',
				'createApproval',
				'updateApproval',
				'deleteApproval'
			]) {
				// @ts-ignore
				allPolicies[match][prop] = allPolicies[match][prop] || policy[prop];
			}
		} else {
			allPolicies.push(policy);
			regexps.push(policy.resultDuosmiumIdRegExp);
		}
	}
	return allPolicies;
}

export async function resultPermissions(userID: string | null, result: string) {
	let allPolicies = await getAllPolicies(userID);
	allPolicies = allPolicies.filter((i) => result?.match(new RegExp(i.resultDuosmiumIdRegExp)));
	let createRule = false;
	let readRule = false;
	let updateRule = false;
	let deleteRule = false;
	let createApprovalRule = false;
	let updateApprovalRule = false;
	let deleteApprovalRule = false;
	for (const pol of allPolicies) {
		createRule = createRule || pol.create;
		readRule = readRule || pol.read;
		updateRule = updateRule || pol.update;
		deleteRule = deleteRule || pol.delete;
		createApprovalRule = createApprovalRule || pol.createApproval;
		updateApprovalRule = updateApprovalRule || pol.updateApproval;
		deleteApprovalRule = deleteApprovalRule || pol.deleteApproval;
	}
	return [
		createRule,
		readRule,
		updateRule,
		deleteRule,
		createApprovalRule,
		updateApprovalRule,
		deleteApprovalRule
	];
}

export async function canRead(userID: string | null, result: string) {
	return (await resultPermissions(userID, result))[1];
}

export async function canDelete(userID: string | null, result: string) {
	return (await resultPermissions(userID, result))[3];
}
