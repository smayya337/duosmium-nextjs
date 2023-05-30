export function ResultCount({ num, level }: { num: number; level: string }) {
	return (
		<>
			<dt className={'mdc-typography--headline6'}>{num}</dt>
			<dd className={'mdc-typography--subtitle1'}>{level}</dd>
		</>
	);
}
