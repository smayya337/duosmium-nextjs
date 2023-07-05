import { ResultCountGrid } from '@/components/results/home/ResultCountGrid';
import { ResultRecentList } from '@/components/results/home/ResultRecentList';
import { siteConfig } from '@/config/site';
import { Result } from '@prisma/client';
import Link from 'next/link';

export function Hero({
	countsByLevel,
	recentResults
}: {
	countsByLevel: object;
	recentResults: Result[];
}) {
	return (
		<div className={'pb-4 px-4'}>
			<h1 className={'text-center tracking-tight font-bold text-4xl'}>{siteConfig.name}</h1>
			<div className={'flex flex-col lg:flex-row justify-between max-h-full'}>
				{/* @ts-ignore */}
				<ResultRecentList results={recentResults} />
				<ResultCountGrid countsByLevel={countsByLevel} />
			</div>
		</div>
	);
}
