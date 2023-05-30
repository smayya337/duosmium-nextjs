import { Suspense } from 'react';
import { cacheCompleteResult } from '@/lib/results/async';
import { getAllReadableResults, getRecentReadableResults } from '@/lib/results/filter';
import { getServerComponentSupabaseClient } from '@/lib/global/supabase';
import { cookies, headers } from 'next/headers';
import { getCurrentUserID } from '@/lib/auth/helpers';
import { ResultCard } from '@/components/results/home/ResultCard';
import { ResultCardGrid } from '@/components/results/home/ResultCardGrid';
import { Navbar } from '@/components/global/Navbar';
import { Main } from '@/components/global/Main';
import { Hero } from '@/components/results/home/Hero';
import { getAllReadableTournamentsByLevel } from '@/lib/tournaments/filter';

function preload(duosmiumID: string) {
	void cacheCompleteResult(duosmiumID);
}

export default async function Page() {
	const supabase = getServerComponentSupabaseClient(headers, cookies);
	const userID = await getCurrentUserID(supabase);
	const allResults = await getAllReadableResults(userID, false, 24);
	const recents = await getRecentReadableResults(userID, 5);
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
		countsByLevel[pretty] = (await getAllReadableTournamentsByLevel(userID, level)).length;
		// @ts-ignore
		totalTournaments += countsByLevel[pretty];
	}
	// @ts-ignore
	countsByLevel['Total'] = totalTournaments;
	return (
		<>
			<Navbar />
			<Main>
				<Hero countsByLevel={countsByLevel} recentIDs={recents} />
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
			</Main>
		</>
	);
}
