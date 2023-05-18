import { dump } from 'js-yaml';
import type { Interpreter, Team, Tournament } from 'sciolyff/dist/src/interpreter/types';
import { JSON_OPTIONS, STATES_BY_POSTAL_CODE, YAML_OPTIONS } from '@/lib/global/helpers';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/global/supabase';
import { getResult, resultExists } from '@/lib/results/async';
// @ts-ignore
import { Placing } from 'sciolyff/interpreter';
import Vibrant from 'node-vibrant';
// @ts-ignore
import chroma from 'chroma-js';

// @ts-ignore
import { ContrastChecker } from 'color-contrast-calc';
import colors from '@/lib/global/colors';

export function objectToYAML(obj: object) {
	return dump(obj).replaceAll('T00:00:00.000Z', '');
}

export function objectToJSON(obj: object) {
	return JSON.stringify(obj).replaceAll('T00:00:00.000Z', '');
}

export function exportYAMLOrJSON(url: URL, obj: object, yamlName: string) {
	if (
		typeof url.searchParams.get('format') === 'string' &&
		// @ts-ignore
		url.searchParams.get('format').toLowerCase() === 'yaml'
	) {
		const myYAMLOptions = YAML_OPTIONS;
		// @ts-ignore
		myYAMLOptions['headers']['content-disposition'] = `attachment; filename=${yamlName}.yaml`;
		return new NextResponse(objectToYAML(obj), myYAMLOptions);
	} else {
		return new NextResponse(objectToJSON(obj), JSON_OPTIONS);
	}
}

function expandStateName(postalCode: string | undefined) {
	if (postalCode === undefined) {
		throw new Error('Postal code is undefined!');
	}
	// @ts-ignore
	return STATES_BY_POSTAL_CODE[postalCode];
}

export function generateFilename(interpreter: Interpreter) {
	if (interpreter.tournament.startDate === undefined) {
		throw new Error('Tournament has no start date!');
	}
	let output = '';
	output += interpreter.tournament.startDate.getUTCFullYear();
	output += '-' + (interpreter.tournament.startDate.getUTCMonth() + 1).toString().padStart(2, '0');
	output += '-' + interpreter.tournament.startDate.getUTCDate().toString().padStart(2, '0');
	switch (interpreter.tournament.level) {
		case 'Nationals':
			output += '_nationals';
			break;
		case 'States':
			output += `_${interpreter.tournament.state}_states`;
			break;
		case 'Regionals':
			output += `_${interpreter.tournament.state}_${cleanString(
				getRelevantString(interpreter).toLowerCase().split('regional')[0]
			)}regional`;
			break;
		default:
			output += `_${cleanString(
				getRelevantString(interpreter).toLowerCase().split('invitational')[0]
			)}invitational`;
			break;
	}
	if (
		interpreter.tournament.level === 'Regionals' ||
		interpreter.tournament.level === 'Invitational'
	) {
		const nameParts = getRelevantString(interpreter)
			.toLowerCase()
			.split(interpreter.tournament.level === 'Regionals' ? 'regional' : 'invitational');
		if (nameParts.length > 1) {
			for (let i = 1; i < nameParts.length; i++) {
				output += '_' + cleanString(nameParts[i].trim());
			}
			output = output.substring(0, output.length - 1);
		}
	}
	output += '_' + interpreter.tournament.division.toLowerCase();
	output = output.replace(/_+/g, '_');
	return output;
}

function cleanString(s: string) {
	return s.replaceAll(/\./g, '').replaceAll(/[^A-Za-z0-9]/g, '_');
}

export function tournamentTitle(tInfo: Tournament) {
	if (tInfo.name) return tInfo.name;

	switch (tInfo.level) {
		case 'Nationals':
			return 'Science Olympiad National Tournament';
		case 'States':
			return `${expandStateName(tInfo.state)} Science Olympiad State Tournament`;
		case 'Regionals':
			return `${tInfo.location} Regional Tournament`;
		case 'Invitational':
			return `${tInfo.location} Invitational`;
	}
}

export function tournamentTitleShort(tInfo: Tournament) {
	switch (tInfo.level) {
		case 'Nationals':
			return 'National Tournament';
		case 'States':
			// @ts-ignore
			return `${tInfo.state.replace('sCA', 'SoCal').replace('nCA', 'NorCal')} State Tournament`;
		case 'Regionals':
		case 'Invitational':
			if (!tInfo.shortName && tInfo.name) {
				const cut = tInfo.level === 'Regionals' ? 'Regional' : 'Invitational';
				const splits = tInfo.name.split(cut, 2)[0];
				return `${splits} ${cut}${cut === 'Regional' ? ' Tournament' : ''}`;
			}
			return tInfo.shortName;
	}
}

export function formatSchool(team: Team) {
	if (team.schoolAbbreviation) {
		return abbrSchool(team.schoolAbbreviation);
	}
	return abbrSchool(team.school);
}

function abbrSchool(school: string) {
	return (
		school
			// .replace('Elementary School', 'Elementary')
			.replace('Elementary School', 'E.S.')
			.replace('Elementary/Middle School', 'E.M.S.')
			.replace('Middle School', 'M.S.')
			.replace('Junior High School', 'J.H.S.')
			.replace(/Middle[ /-]High School/, 'M.H.S')
			.replace('Junior/Senior High School', 'Jr./Sr. H.S.')
			.replace('High School', 'H.S.')
			// .replace('Secondary School', 'Secondary');
			.replace('Secondary School', 'S.S.')
	);
}

function fullSchoolName(team: Team) {
	return `${team.school} (${teamLocation(team)})`;
}

function fullTeamName(team: Team) {
	return `${team.school} ${team.suffix ? team.suffix + ' ' : ''}(${teamLocation(team)})`;
}

export function teamLocation(team: Team) {
	return team.city ? `${team.city}, ${team.state}` : `${team.state}`;
}

// from https://stackoverflow.com/questions/13627308/
export const ordinalize = (i: number) => {
	const j = i % 10,
		k = i % 100;
	if (j == 1 && k != 11) {
		return i + 'st';
	}
	if (j == 2 && k != 12) {
		return i + 'nd';
	}
	if (j == 3 && k != 13) {
		return i + 'rd';
	}
	return i + 'th';
};

export function dateString(i: Interpreter): string {
	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const monthsOfYear = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	if (i.tournament.startDate && i.tournament.endDate) {
		let s = `${daysOfWeek[i.tournament.startDate.getUTCDay()]}, ${
			monthsOfYear[i.tournament.startDate.getUTCMonth()]
		} ${i.tournament.startDate.getUTCDate()}, ${i.tournament.startDate.getUTCFullYear()}`;
		const e = `${daysOfWeek[i.tournament.endDate.getUTCDay()]}, ${
			monthsOfYear[i.tournament.endDate.getUTCMonth()]
		} ${i.tournament.endDate.getUTCDate()}, ${i.tournament.endDate.getUTCFullYear()}`;
		if (s != e) {
			s += ' - ' + e;
		}
		return s;
	}
	return 'Your date is broken.';
}

function getRelevantString(i: Interpreter): string {
	if (i.tournament.name === undefined && i.tournament.shortName === undefined) {
		throw new Error('Tournament has neither a name nor a short name!');
	} else if (i.tournament.name !== undefined && i.tournament.shortName === undefined) {
		return i.tournament.name;
	} else if (i.tournament.name !== undefined && i.tournament.shortName !== undefined) {
		return i.tournament.shortName;
	}
	return '';
}

export function fullTournamentTitle(tournament: Tournament) {
	return `${tournament.year} ${tournamentTitle(
		tournament
	)} (Div. ${tournament.division.toUpperCase()})`;
}

export function fullTournamentTitleShort(tournament: Tournament) {
	return `${tournament.year} ${tournamentTitleShort(
		tournament
	)} (Div. ${tournament.division.toUpperCase()})`;
}

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

export async function findBgColor(duosmiumID: string) {
	if (await resultExists(duosmiumID)) {
		const dbEntry = (await getResult(duosmiumID)).color;
		if (dbEntry) {
			return dbEntry;
		}
	}
	return await createBgColor(duosmiumID);
}

export async function createBgColor(duosmiumID: string) {
	const logo = await findLogoPath(duosmiumID);
	return await createBgColorFromImagePath(logo);
}

export async function createBgColorFromImagePath(imagePath: string, dark = false) {
	const logoData = (
		await supabase.storage.from('images').download(imagePath.replace('/images/', ''))
	).data;
	let output: string = 'Indigo 900';
	if (logoData) {
		// @ts-ignore
		const arrayBuffer = await logoData.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const builder = Vibrant.from(buffer);
		const extracted = await builder.getPalette();
		let possibleColors;
		if (dark) {
			possibleColors = [
				extracted.LightMuted,
				extracted.Muted,
				extracted.DarkMuted,
				extracted.LightVibrant,
				extracted.Vibrant,
				extracted.DarkVibrant
			].filter((color) => color != null);
		} else {
			possibleColors = [
				extracted.DarkVibrant,
				extracted.Vibrant,
				extracted.LightVibrant,
				extracted.DarkMuted,
				extracted.Muted,
				extracted.LightMuted
			].filter((color) => color != null);
		}
		if (possibleColors.length > 0) {
			let nearest = require('nearest-color').from(colors);
			// @ts-ignore
			output = nearest(possibleColors[0].hex).name;
			let order;
			let base;
			if (dark) {
				order = [900, 800, 700, 600, 500, 400, 300, 200, 100, 50];
				base = '#000000';
			} else {
				order = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
				base = '#ffffff';
			}
			let currentNumber = Number(output.split(' ').pop());
			let currentColor = output.replace(` ${currentNumber}`, '');
			for (let i = 0; i < order.length; i++) {
				if (i < order.indexOf(currentNumber)) {
					continue;
				}
				currentNumber = order[i];
				const colorName = [currentColor, currentNumber].join(' ');
				// @ts-ignore
				if (ContrastChecker.contrastRatio(base, colors[colorName]) >= 5.5) {
					break;
				}
			}
			output = [currentColor, currentNumber].join(' ');
		}
	}
	return output;
}

const trophyAndMedalColors = [
	'#ffee58',
	'#cfd8dc',
	'#d8bf99',
	'#ffefc0',
	'#dcedc8',
	'#eeccff',
	'#fdd5b4',
	'#d4f0f1',
	'#ffc8db',
	'#dab9d1',
	'#e5e5e5',
	'#e5e5e5',
	'#e5e5e5',
	'#e5e5e5',
	'#e5e5e5',
	'#f4f4f4',
	'#f4f4f4',
	'#f4f4f4',
	'#f4f4f4',
	'#f4f4f4'
];

function trophyAndMedalCss(trophies: number, medals: number, reverse = false) {
	return trophyAndMedalColors
		.map((color, i) => {
			let output = [];
			if (i < medals) {
				output.push(
					// @ts-ignore
					`td.event-points[data-points='${reverse ? reverse - i : i + 1}'] div`
				);
				output.push(
					`td.event-points-focus[data-points='${
						// @ts-ignore
						reverse ? reverse - i : i + 1
					}'] div`
				);
				output.push(
					// @ts-ignore
					`div#team-detail tr[data-points='${reverse ? reverse - i : i + 1}']`
				);
			}
			if (i < trophies) {
				output.push(`td.rank[data-points='${i + 1}'] div`);
			}
			if (output.length > 0) {
				// @ts-ignore
				output = output.join(',') + `{background-color: ${color};border-radius: 1em;}`;
			}
			return output;
		})
		.join('');
}

function acronymize(phrase: string) {
	return phrase
		.split(' ')
		.filter((w) => /^[A-Z]/.test(w))
		.map((w) => w[0])
		.join('');
}

function acronymizeFull(phrase: string) {
	return phrase
		.split(' ')
		.map((w) => w[0])
		.join('');
}

function keywords(interpreter: Interpreter) {
	const t = interpreter.tournament;
	const words = [
		t.name,
		t.shortName,
		t.location,
		t.name ? acronymize(t.name) : null,
		t.name ? acronymizeFull(t.name) : null,
		t.location && t.location.split(' ').length > 1 ? acronymize(t.location) : null,
		t.name ? acronymize(t.name.replace('Tournament', 'Science Olympiad')) : null,
		t.name ? acronymizeFull(t.name.replace('Tournament', 'Science Olympiad')) : null,
		t.level,
		t.level === 'Nationals' ? 'nats' : null,
		t.level === 'Nationals' ? 'sont' : null,
		t.level === 'Invitational' ? 'invite' : null,
		t.level === 'Regionals' ? 'regs' : null,
		t.state,
		t.state ? expandStateName(t.state) : null,
		t.state === 'nCA' ? 'norcal' : null,
		t.state === 'sCA' ? 'socal' : null,
		t.state === 'nCA' || t.state === 'sCA' ? 'california' : null,
		`div-${t.division}`,
		`division-${t.division}`,
		t.year,
		t.date ? t.date.toISOString().split('T')[0] : null,
		t.date
			? t.date.toLocaleDateString(undefined, {
					weekday: 'long',
					timeZone: 'UTC'
			  })
			: null,
		t.date ? t.date.toLocaleDateString(undefined, { month: 'long', timeZone: 'UTC' }) : null,
		t.date ? t.date.getUTCDate() : null,
		t.date ? t.date.getUTCFullYear() : null,
		t.startDate ? t.startDate.toISOString().split('T')[0] : null,
		t.startDate
			? t.startDate.toLocaleDateString(undefined, {
					weekday: 'long',
					timeZone: 'UTC'
			  })
			: null,
		t.startDate
			? t.startDate.toLocaleDateString(undefined, {
					month: 'long',
					timeZone: 'UTC'
			  })
			: null,
		t.startDate ? t.startDate.getUTCDate() : null,
		t.startDate ? t.startDate.getUTCFullYear() : null,
		t.endDate ? t.endDate.toISOString().split('T')[0] : null,
		t.endDate
			? t.endDate.toLocaleDateString(undefined, {
					weekday: 'long',
					timeZone: 'UTC'
			  })
			: null,
		t.endDate
			? t.endDate.toLocaleDateString(undefined, {
					month: 'long',
					timeZone: 'UTC'
			  })
			: null,
		t.endDate ? t.endDate.getUTCDate() : null,
		t.endDate ? t.endDate.getUTCFullYear() : null,
		'science',
		'olympiad',
		'tournament',
		interpreter.histograms !== undefined ? 'histograms' : null
	];
	return Array.from(
		words
			// split spaces, dedupe, convert to lowercase, remove nulls
			.reduce((acc, v) => {
				if (v) {
					v.toString()
						.split(' ')
						.forEach((w: string) => acc.add(w.toLowerCase()));
				}
				return acc;
			}, new Set())
	).join(' ');
}

export function teamAttended(team: Team) {
	return team.placings?.map((p) => p.participated).some((p) => p);
}

const summaryTitles = [
	'Champion',
	'Runner-up',
	'Third-place',
	'Fourth-place',
	'Fifth-place',
	'Sixth-place'
];

function supTag(placing: Placing) {
	const exempt = placing.exempt || placing.droppedAsPartOfWorstPlacings;
	const tie = placing.tie && !placing.pointsLimitedByMaximumPlace;
	if (tie || exempt) {
		return `<sup>${exempt ? '◊' : ''}${tie ? '*' : ''}</sup>`;
	}
	return '';
}

function bidsSupTag(team: Team) {
	return team.earnedBid ? '<sup>✧</sup>' : '';
}

function bidsSupTagNote(tournament: Tournament) {
	const nextTournament =
		tournament.level === 'Regionals'
			? // @ts-ignore
			  `${tournament.state.replace('sCA', 'SoCal').replace('nCA', 'NorCal')} State Tournament`
			: 'National Tournament';
	// @ts-ignore
	const qualifiee = tournament.bidsPerSchool > 1 ? 'team' : 'school';
	return `Qualified ${qualifiee} for the ${tournament.year} ${nextTournament}`;
}

function placingNotes(placing: Placing) {
	const place = placing.place;
	const points = placing.isolatedPoints;
	return [
		placing.event.trial ? 'trial event' : null,
		placing.event.trialed ? 'trialed event' : null,
		placing.disqualified ? 'disqualified' : null,
		placing.didNotParticipate ? 'did not participate' : null,
		placing.participationOnly ? 'participation points only' : null,
		placing.tie ? 'tie' : null,
		placing.exempt ? 'exempt' : null,
		placing.pointsLimitedByMaximumPlace ? 'points limited' : null,
		placing.unknown ? 'unknown place' : null,
		placing.pointsAffectedByExhibition && place - points == 1
			? 'placed behind exhibition team'
			: null,
		placing.pointsAffectedByExhibition && place - points > 1
			? 'placed behind exhibition teams'
			: null,
		placing.droppedAsPartOfWorstPlacings ? 'dropped' : null
	]
		.flatMap((s) => (s ? [s[0].toUpperCase() + s.slice(1)] : []))
		.join(', ');
}

function teamsToStates(interpreter: Interpreter) {
	return Array.from(
		interpreter.teams.reduce((acc, t) => {
			acc.add(t.state);
			return acc;
		}, new Set())
		// @ts-ignore
	).sort((a, b) => a.localeCompare(b));
}

function fmtDate(date: Date) {
	return date.toLocaleDateString(undefined, {
		weekday: 'long',
		timeZone: 'UTC',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

function timeDelta(time: number) {
	return Date.now() - time;
}

function escapeCsv(s: any) {
	if (typeof s !== 'string') {
		return s;
	}
	if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
		return `"${s.replace(/"/g, '""')}"`;
	}
	return s;
}
