import { getAllTeamsBySchool } from '@/lib/teams/async';
import { redirect } from 'next/navigation';

// @ts-ignore
export async function generateMetadata({ params }) {
	return { title: 'By School | Duosmium Results' };
}

export default async function Page() {
	const allData = await getAllTeamsBySchool();
	if (allData.length === 0) {
		return (
			<>
				<h1 className={'text-center tracking-tight font-bold text-4xl pb-2'}>
					All Results by School
				</h1>
				<p className={'text-center'}>Sorry, no information is available.</p>
			</>
		);
	}
	const letter: string = allData[0].name.charAt(0).toLowerCase();
	redirect(`/results/schools/${letter}`);
}
