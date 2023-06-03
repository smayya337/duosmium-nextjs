import { cacheCompleteResult } from '@/lib/results/async';
import { fullTournamentTitle } from '@/lib/results/helpers';
import { getInterpreter } from '@/lib/results/interpreter';
import Link from 'next/link';

export async function ResultRecent({ duosmiumID }: { duosmiumID: string }) {
	const completeResult = await cacheCompleteResult(duosmiumID);
	const interpreter = getInterpreter(completeResult);
	return (
		<li>
			<Link href={`/results/${duosmiumID}`} className={"text-md"}>{fullTournamentTitle(interpreter.tournament)}</Link>
		</li>
	);
}
