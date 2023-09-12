import { drizzle } from 'drizzle-orm/postgres-js';
import postgres, { PostgresError } from 'postgres';
import * as schema from './schema';

// @ts-ignore
const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema });

// @ts-ignore
export async function keepTryingUntilItWorks(fn, data) {
	try {
		return await fn(data);
		// @ts-ignore
	} catch (e: PostgresError) {
		if (e.message === 'deadlock detected') {
			return await keepTryingUntilItWorks(fn, data);
		}
	}
}
