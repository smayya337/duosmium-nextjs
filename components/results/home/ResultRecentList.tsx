import { ResultRecent } from '@/components/results/home/ResultRecent';

export async function ResultRecentList({ ids }: { ids: string[] }) {
	return (
		<div>
			<h3 className={'font-bold text-2xl tracking-tight text-center py-2'}>Recently Added</h3>
			<ul className={'list-disc'}>
				{/*@ts-ignore*/}
				{ids.map(async (i) => {
					return <ResultRecent duosmiumID={i} key={i} />;
				})}
			</ul>
		</div>
	);
}
