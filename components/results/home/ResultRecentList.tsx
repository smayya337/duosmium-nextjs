import { ResultRecent } from '@/components/results/home/ResultRecent';

export async function ResultRecentList({ ids }: { ids: string[] }) {
	return (
		<div>
			<h5 className={'mdc-typography--headline5'}>Recently Added</h5>
			<ul>
				{ids.map(async (i) => {
					await (<ResultRecent duosmiumID={i} />);
				})}
			</ul>
		</div>
	);
}
