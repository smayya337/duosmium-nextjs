import { ResultCountGrid } from '@/components/results/home/ResultCountGrid';
import { ResultRecentList } from '@/components/results/home/ResultRecentList';
import { siteConfig } from '@/config/site';

export function Hero({ countsByLevel, recentIDs }: { countsByLevel: object; recentIDs: string[] }) {
	return (
		<div className={'pb-4 px-4'}>
			<h1 className={'text-center tracking-tight font-bold text-4xl'}>{siteConfig.name}</h1>
			<div className={'flex flex-row justify-between max-h-full'}>
				<ResultRecentList ids={recentIDs} />
				<ResultCountGrid countsByLevel={countsByLevel} />
			</div>
		</div>
	);
}
