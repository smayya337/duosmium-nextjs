import { ResultCount } from '@/components/results/home/ResultCount';

export function ResultCountGrid({ countsByLevel }: { countsByLevel: object }) {
	return (
		<div>
			<h5 className={'mdc-typography--headline5'}>Archive Totals</h5>
			<dl style={{ display: 'grid' }}>
				{Object.entries(countsByLevel).map((entry) => {
					const [level, num] = entry;
					return <ResultCount num={num} level={level} key={level} />;
				})}
			</dl>
		</div>
	);
}
