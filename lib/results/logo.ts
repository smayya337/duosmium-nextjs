import { supabase } from '@/lib/global/supabase';
import { getResult, resultExists } from '@/lib/results/async';

export async function findLogoPath(duosmiumID: string) {
	if (await resultExists(duosmiumID)) {
		const dbEntry = (await getResult(duosmiumID)).logo;
		if (dbEntry) {
			return dbEntry;
		}
	}
	return await createLogoPath(duosmiumID);
}

export async function createLogoPath(duosmiumID: string) {
	const tournamentYear = parseInt(duosmiumID.slice(0, 4));
	const tournamentName = duosmiumID.slice(11, -2).replace('_no_builds', '');
	const getYear = (image: string) => parseInt(image.match(/^\d+/)?.[0] ?? '0');

	const images = (await supabase.storage.from('images').list('logos')).data?.map((img) => img.name);
	let selected: string;
	if (images == null) {
		selected = 'default.jpg';
	} else {
		const sameDivision = images.filter((image) =>
			duosmiumID.endsWith(image.split('.')[0].match(/_[abc]$/)?.[0] ?? '')
		);

		const hasTournName = sameDivision.filter(
			(image) =>
				image.startsWith(tournamentName) || image.startsWith(tournamentYear + '_' + tournamentName)
		);

		// use state logo if regional logo does not exist
		let stateFallback: string[] = [];
		if (/_regional_[abc]$/.test(duosmiumID)) {
			const stateName = duosmiumID.split('_')[1] + '_states';
			stateFallback = sameDivision.filter((image) => image.includes(stateName));
		}

		// remove format info from name
		let withoutFormat: string[] = [];
		if (/(mini|satellite|in-person)_?(so)?_/.test(duosmiumID)) {
			const nameWithoutFormat = tournamentName.replace(/(mini|satellite|in-person)_?(so)?_/, '');
			withoutFormat = sameDivision.filter((image) => image.includes(nameWithoutFormat));
		}

		const recentYear = hasTournName
			.concat(...withoutFormat, stateFallback, 'default.jpg')
			.filter((image) => getYear(image) <= tournamentYear);
		selected = recentYear.reduce((prev, curr) => {
			const currentScore = getYear(curr) + curr.length / 100;
			const prevScore = getYear(prev) + prev.length / 100;
			return currentScore > prevScore ? curr : prev;
		});
	}
	return '/images/logos/' + selected;
}
