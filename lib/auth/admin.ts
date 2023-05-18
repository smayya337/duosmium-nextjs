import { prisma } from '@/lib/global/prisma';

export async function isAdmin(userID: string | null) {
	if (userID === null) {
		return false;
	}
	const adminList = (
		await prisma.membership.findMany({
			where: {
				organization: {
					orgName: 'admin'
				}
			},
			select: {
				userId: true
			}
		})
	).map((i) => i.userId);
	return adminList.includes(userID);
}
