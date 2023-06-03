export function ResultCount({ num, level }: { num: number; level: string }) {
	return (
		<>
			<dt className={'text-right font-semibold text-xl'}>{num}</dt>
			<dd className={'text-left font-normal text-xl'}>{level}</dd>
		</>
	);
}
