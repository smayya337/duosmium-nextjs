import { ResultCount } from '@/components/results/home/ResultCount';

export function ResultCountGrid({ countsByLevel }: { countsByLevel: object }) {
	return (
		<div>
			<h3 className={'font-bold text-2xl tracking-tight text-center py-2'}>Archive Totals</h3>
			<dl className={'grid grid-cols-2 gap-x-4'}>
				{Object.entries(countsByLevel).map((entry) => {
					const [level, num] = entry;
					return <ResultCount num={num} level={level} key={level} />;
				})}
			</dl>
		</div>
	);
}
