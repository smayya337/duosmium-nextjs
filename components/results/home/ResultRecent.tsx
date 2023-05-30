import { cacheCompleteResult } from '@/lib/results/async';
import { getInterpreter } from '@/lib/results/interpreter';
import Link from 'next/link';
import { fullTournamentTitle } from '@/lib/results/helpers';

export async function ResultRecent({ duosmiumID }: { duosmiumID: string }) {
	const completeResult = await cacheCompleteResult(duosmiumID);
	const interpreter = getInterpreter(completeResult);
	return (
		<li>
			<Link href={`/results/${duosmiumID}`}>{fullTournamentTitle(interpreter.tournament)}</Link>
		</li>
	);
}
