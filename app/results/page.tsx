import { Hero } from '@/components/results/home/Hero';
import { ResultCard } from '@/components/results/home/ResultCard';
import { ResultCardGrid } from '@/components/results/home/ResultCardGrid';
import { cacheCompleteResult, getAllResults, getRecentResults } from '@/lib/results/async';
import { getAllTournamentsByLevel } from '@/lib/tournaments/async';
import Link from 'next/link';
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
			<Hero countsByLevel={countsByLevel} recentResults={recents} />
			{/*<h2 className={'pb-4 text-3xl font-bold tracking-tight transition-colors text-center'}>*/}
			{/*	Recent Tournaments*/}
			{/*</h2>*/}
			{/*<ResultCardGrid>*/}
			{/*	{allResults.map((r) => {*/}
			{/*		return (*/}
			{/*			<Suspense key={r.duosmiumId}>*/}
			{/*				/!* @ts-ignore *!/*/}
			{/*				<ResultCard meta={r} />*/}
			{/*			</Suspense>*/}
			{/*		);*/}
			{/*	})}*/}
			{/*</ResultCardGrid>*/}
			{/*<h2 className={'py-4 text-3xl font-bold tracking-tight transition-colors text-center'}>*/}
			{/*	Past Tournaments*/}
			{/*</h2>*/}
			{/*<p className={'text-center'}>*/}
			{/*	Searching for something that&apos;s not listed here? Check out our{' '}*/}
			{/*	<Link href={'/results/all'} className={'text-sky-700 dark:text-sky-500 hover:underline'}>*/}
			{/*		full list*/}
			{/*	</Link>*/}
			{/*	!*/}
			{/*</p>*/}
		</>
	);
}
