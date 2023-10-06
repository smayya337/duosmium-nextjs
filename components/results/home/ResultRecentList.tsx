import { ResultRecent } from '@/components/results/home/ResultRecent';
import { Result } from '@/lib/global/schema';

export function ResultRecentList({ results }: { results: Result[] }) {
	return (
		<div className={'text-center'}>
			<h3 className={'font-bold text-2xl tracking-tight py-2'}>Recently Added</h3>
			<ul className={'list-disc'}>
				{results.map((i) => {
					/*@ts-ignore*/
					return <ResultRecent result={i} key={i.duosmiumId} />;
				})}
			</ul>
		</div>
	);
}
