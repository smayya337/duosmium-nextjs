import { Main } from '@/components/global/Main';
import { Navbar } from '@/components/global/Navbar';
import { Hero } from '@/components/results/home/Hero';
import { ResultCard } from '@/components/results/home/ResultCard';
import { ResultCardGrid } from '@/components/results/home/ResultCardGrid';
import { cacheCompleteResult, getAllResults, getRecentResults } from '@/lib/results/async';
import { getAllTournamentsByLevel } from '@/lib/tournaments/async';
import { Suspense } from 'react';

function preload(duosmiumID: string) {
	void cacheCompleteResult(duosmiumID);
}

export default async function Page() {
	const allResults = await getAllResults(false, 24);
	const recents = await getRecentResults(false, 5);
	for (const res of allResults) {
		preload(res.duosmiumId);
	}
	for (const res of recents) {
		preload(res.duosmiumId);
	}
	const countsByLevel = {};
	let totalTournaments = 0;
	const levelToPretty = {
		Nationals: 'National Tournaments',
		States: 'State Tournaments',
		Regionals: 'Regionals',
		Invitational: 'Invitationals'
	};
	for (const level of Object.keys(levelToPretty)) {
		// @ts-ignore
		const pretty: string = levelToPretty[level];
		// @ts-ignore
		countsByLevel[pretty] = (await getAllTournamentsByLevel(level)).length;
		// @ts-ignore
		totalTournaments += countsByLevel[pretty];
	}
	// @ts-ignore
	countsByLevel['Total'] = totalTournaments;
	return (
		<>
			<Hero countsByLevel={countsByLevel} recentIDs={recents.map((r) => r.duosmiumId)} />
			<h2 className={'pb-4 text-3xl font-semibold tracking-tight transition-colors text-center'}>
				Recent Tournaments
			</h2>
			<ResultCardGrid>
				{allResults.map((r) => {
					return (
						<Suspense key={r.duosmiumId}>
							{/* @ts-ignore */}
							<ResultCard meta={r} />
						</Suspense>
					);
				})}
			</ResultCardGrid>
		</>
	);
}
