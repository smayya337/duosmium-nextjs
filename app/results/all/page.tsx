import { ResultSeason } from '@/components/results/all/ResultSeason';
import { getAllResults } from '@/lib/results/async';

// @ts-ignore
export async function generateMetadata({ params }) {
	return { title: 'By Season | Duosmium Results' };
}

export default async function Page() {
	const allResults = await getAllResults(false);
	const seasons: number[] = [];
	const resultsBySeason = {};
	for (const result of allResults) {
		const resultSeason = Number(result.fullTitle.split(' ')[0]);
		if (seasons.length === 0 || seasons[seasons.length - 1] !== resultSeason) {
			seasons.push(resultSeason);
			// @ts-ignore
			resultsBySeason[resultSeason] = [];
		}
		// @ts-ignore
		resultsBySeason[resultSeason].push(result);
	}
	return (
		<div className="containuer">
			<h1 className={'text-center tracking-tight font-bold text-4xl pb-2'}>
				All Results by Season
			</h1>
			<div>
				{seasons.map((s) => {
					// @ts-ignore
					return <ResultSeason season={s} results={resultsBySeason[s]} key={s} />;
				})}
			</div>
		</div>
	);
}
