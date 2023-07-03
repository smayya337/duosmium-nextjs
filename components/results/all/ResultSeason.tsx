import { OfficialBadge } from '@/components/results/home/OfficialBadge';
import { PreliminaryBadge } from '@/components/results/home/PreliminaryBadge';
import { Result } from '@prisma/client';
import Link from 'next/link';

export function ResultSeason({ season, results }: { season: number; results: Result[] }) {
	return (
		<div className={'py-2'}>
			<h2 className={'font-bold text-2xl tracking-tight text-left pb-1'}>{season}</h2>
			<hr />
			<ul className={'list-disc pt-1'}>
				{results.map((r) => {
					return (
						<li className={'list-inside'} key={r.duosmiumId}>
							<Link
								href={`/results/${r.duosmiumId}`}
								className={'text-sky-700 dark:text-sky-500 hover:underline'}
							>
								{r.fullTitle}
							</Link>{' '}
							— {r.date} @ {r.locationName}
							{r.official && <OfficialBadge className={'ml-1'} />}
							{r.preliminary && <PreliminaryBadge className={'ml-1'} />}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
