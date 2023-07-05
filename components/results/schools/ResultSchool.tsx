import { ordinalize } from '@/lib/results/helpers';
import { Location, Result } from '@prisma/client';
import Link from 'next/link';

export function ResultSchool({
	location,
	ranks,
	results
}: {
	location: Location;
	ranks: Map<string, number[]>;
	results: Result[];
}) {
	const ids: string[] = [];
	for (const id of ranks.keys()) {
		ids.push(id);
	}
	const rankStrings: string[] = [];
	ids.forEach((value) => {
		const rankList = ranks.get(value);
		if (rankList !== undefined) {
			let rankString = '';
			for (let i = 0; i < rankList.length; i++) {
				rankString += ordinalize(rankList[i]);
				if (i < rankList.length - 1) {
					rankString += ', ';
				}
			}
			rankStrings.push(rankString);
		}
	});
	const resultMap: Map<string, Result> = new Map();
	results.forEach((value) => {
		resultMap.set(value.duosmiumId, value);
	});
	const formattedSchoolName = `${location.name} (${location.city ? `${location.city}, ` : ''}${
		location.state ?? location.country
	})`;
	return (
		<div className={'py-2'}>
			<h2 className={'font-bold text-2xl tracking-tight text-left pb-1'} id={formattedSchoolName}>
				{formattedSchoolName}
			</h2>
			<hr />
			<ul className={'list-disc pt-1'}>
				{ids.map((value, index) => {
					return (
						<li className={'list-inside'} key={value}>
							<Link
								href={`/results/${value}`}
								className={'text-sky-700 dark:text-sky-500 hover:underline'}
							>
								{resultMap.get(value)?.fullTitle}
							</Link>{' '}
							— {rankStrings[index]}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
