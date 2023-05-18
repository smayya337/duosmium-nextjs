'use server';
import { User } from '@supabase/supabase-js';
import prisma from '@/lib/global/prisma';

export async function createPrismaUser(user: User | null, username: FormDataEntryValue) {
	if (user === null) {
		throw new Error('User cannot be null!');
	}
	await prisma.user.create({
		data: {
			id: user.id,
			username: username.toString()
		}
	});
	await prisma.membership.create({
		data: {
			userId: user.id,
			organizationId: (
				await prisma.organization.findUniqueOrThrow({ where: { orgName: 'public' } })
			).id
		}
	});
	await prisma.membership.create({
		data: {
			userId: user.id,
			organizationId: (
				await prisma.organization.findUniqueOrThrow({ where: { orgName: 'users' } })
			).id
		}
	});
}
