import { Location } from '@/lib/global/schema';
import Link from 'next/link';

export default function AllSchoolLetters({
	rankData
}: {
	rankData: Map<Location, Map<string, number[]>>;
}) {
	const letters: string[] = [];
	for (const loc of rankData.keys()) {
		const letter = loc.name.charAt(0).toLowerCase();
		if (letters.indexOf(letter) < 0) {
			letters.push(letter);
		}
	}
	return (
		<ol className={'flex flex-wrap list-none justify-center py-2'}>
			{letters.map((l) => {
				return (
					<li
						key={l}
						className={
							"before:content-['•'] before:mx-2 first:before:content-none first:before:mx-0 text-lg"
						}
					>
						<Link
							href={`/results/schools/${l}`}
							className={'text-sky-700 dark:text-sky-500 hover:underline'}
						>
							{l.toUpperCase()}
						</Link>
					</li>
				);
			})}
		</ol>
	);
}
