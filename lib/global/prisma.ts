// @ts-ignore
import { PrismaClient } from '@prisma/client';
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient();
} else {
	// @ts-ignore
	if (!global.prisma) {
		// @ts-ignore
		global.prisma = new PrismaClient();
	}
	// @ts-ignore
	prisma = global.prisma;
}

export default prisma;

// @ts-ignore
export async function keepTryingUntilItWorks(fn, data) {
	try {
		return await fn(data);
		// @ts-ignore
	} catch (e: PrismaClientKnownRequestError) {
		return await keepTryingUntilItWorks(fn, data);
	}
}
