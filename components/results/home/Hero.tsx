import { ResultCountGrid } from '@/components/results/home/ResultCountGrid';
import { ResultRecentList } from '@/components/results/home/ResultRecentList';

export function Hero({ countsByLevel, recentIDs }: { countsByLevel: object; recentIDs: string[] }) {
	return (
		<div>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
				<ResultRecentList ids={recentIDs} />
				<ResultCountGrid countsByLevel={countsByLevel} />
			</div>
		</div>
	);
}
