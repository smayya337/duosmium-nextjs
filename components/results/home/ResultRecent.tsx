import Link from 'next/link';
import { Result } from "@prisma/client";

export async function ResultRecent({ result }: { result: Result }) {
	return (
		<li className={'list-inside'}>
			<Link href={`/results/${result.duosmiumId}`} className={'text-md hover:underline'}>
				{result.fullShortTitle}
			</Link>
		</li>
	);
}
