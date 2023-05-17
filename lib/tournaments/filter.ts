import { getReadablePolicyRegex } from '@/lib/results/filter';
import { getAllTournamentsByLevel } from './async';

export async function getAllReadableTournamentsByLevel(userID: string | null, level: string) {
	const policyRegex = await getReadablePolicyRegex(userID);
	return (await getAllTournamentsByLevel(level)).filter((i) =>
		i.resultDuosmiumId.match(policyRegex)
	);
}
