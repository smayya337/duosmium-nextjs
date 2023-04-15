// @ts-ignore
import { PrismaClient } from '@prisma/client';
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export const prisma = new PrismaClient();

// @ts-ignore
export async function keepTryingUntilItWorks(fn, data) {
	try {
		return await fn(data);
		// @ts-ignore
	} catch (e: PrismaClientKnownRequestError) {
		return await keepTryingUntilItWorks(fn, data);
	}
}
