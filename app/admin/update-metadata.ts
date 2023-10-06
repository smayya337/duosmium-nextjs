'use server';

import { regenerateAllMetadata } from '@/lib/results/async';

export async function updateAllMetadata() {
	await regenerateAllMetadata();
}
