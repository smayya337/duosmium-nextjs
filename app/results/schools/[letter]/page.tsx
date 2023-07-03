import AllSchoolLetters from '@/components/results/schools/AllSchoolLetters';
import { ResultSchool } from '@/components/results/schools/ResultSchool';
import { getAllResults } from '@/lib/results/async';
import { getAllSchoolsAndRanks } from '@/lib/teams/async';
import { Location } from '@prisma/client';
import { redirect } from 'next/navigation';

// @ts-ignore
export async function generateMetadata({ params }) {
	return { title: 'By School | Duosmium Results' };
}

export default async function Page({ params }: { params: { letter: string } }) {
	//
	const letter = params.letter.toLowerCase();
	if (letter.length !== 1) {
		redirect('/results/schools');
	}
	const allData = await getAllSchoolsAndRanks();
	const allResults = await getAllResults(false);
	const locations: Location[] = [];
	for (const k of allData.keys()) {
		if (k.name.charAt(0).toLowerCase() === letter) {
			locations.push(k);
		}
	}
	if (locations.length == 0) {
		redirect('/results/schools');
	}
	return (
		<>
			<h1 className={'text-center tracking-tight font-bold text-4xl pb-2'}>
				All Results by School ({letter.toUpperCase()})
			</h1>
			<AllSchoolLetters rankData={allData} />
			{locations.map((l) => {
				// @ts-ignore
				return <ResultSchool location={l} ranks={allData.get(l)} results={allResults} key={l} />;
			})}
		</>
	);
}
