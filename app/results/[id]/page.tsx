// @ts-ignore
import { ResultDataTable } from '@/components/results/view/ResultDataTable';
import { colors } from '@/lib/colors/default';
import { getCompleteResult, resultExists } from '@/lib/results/async';
import {
	dateString,
	findBgColor,
	formatSchool,
	fullTournamentTitle,
	fullTournamentTitleShort,
	generateFilename,
	teamAttended,
	teamLocation
} from '@/lib/results/helpers';
import { getInterpreter } from '@/lib/results/interpreter';
import { notFound } from 'next/navigation';
import { Team } from 'sciolyff/dist/src/interpreter/types';
// @ts-ignore
import Interpreter from 'sciolyff/interpreter';

async function getRequestedInterpreter(id: string) {
	if (!(await resultExists(id))) {
		notFound();
	}
	if (interpreter === null || generateFilename(interpreter) !== id) {
		const result = await getCompleteResult(id);
		interpreter = getInterpreter(result);
	}
	return interpreter;
}

function className(orig: string) {
	return orig.toLowerCase().replaceAll(/\s+/g, '_').replaceAll(/\W/g, '');
}

let interpreter: Interpreter = null;

// @ts-ignore
export async function generateMetadata({ params }) {
	const id = params.id;
	const interpreter: Interpreter = await getRequestedInterpreter(id);
	return { title: `${fullTournamentTitleShort(interpreter.tournament)} | Duosmium Results` };
}

function penaltyPoints(team: Team): number {
	let total = 0;
	team.penalties?.forEach((x) => (total += x.points));
	return total;
}

function processEventData(interpreter: Interpreter) {
	const output = [];
	for (const evt of interpreter.events) {
		if (evt.trial) {
			continue;
		}
		const data = {
			id: className(evt.name),
			name: evt.name,
			trial: evt.trial,
			trialed: evt.trialed,
			medals: evt.medals ?? interpreter.tournament.medals
		};
		output.push(data);
	}
	for (const evt of interpreter.events) {
		if (!evt.trial) {
			continue;
		}
		const data = {
			id: className(evt.name),
			name: evt.name,
			trial: evt.trial,
			trialed: evt.trialed,
			medals: evt.medals ?? interpreter.tournament.medals
		};
		output.push(data);
	}
	return output;
}

function processTeamData(interpreter: Interpreter) {
	const output = [];
	for (const tm of interpreter.teams) {
		const data = {
			number: tm.number,
			team: `${formatSchool(tm)}${tm.suffix ? ' ' + tm.suffix : ''}`,
			location: teamLocation(tm),
			disqualified: tm.disqualified,
			exhibition: tm.exhibition,
			attended: teamAttended(tm),
			earnedBid: tm.earnedBid,
			rank: tm.rank,
			points: tm.points,
			penalties: penaltyPoints(tm)
		};
		for (const evt of interpreter.events) {
			// @ts-ignore
			data[className(evt.name)] = evt.placingFor(tm)?.isolatedPoints;
		}
		output.push(data);
	}
	return output;
}

// @ts-ignore
export default async function Page({ params }) {
	const id = params.id;
	const interpreter: Interpreter = await getRequestedInterpreter(id);
	// @ts-ignore
	const bgColor = colors[await findBgColor(id)];
	const eventData = processEventData(interpreter);
	const teamData = processTeamData(interpreter);
	// noinspection HtmlUnknownTarget
	return (
		<>
			<h1 className={'text-3xl tracking-tight font-bold text-center pb-4'}>
				{fullTournamentTitle(interpreter.tournament)}
			</h1>
			<p className={'text-lg tracking-tight text-muted-foreground text-center'}>
				{dateString(interpreter)}
			</p>
			<p className={'text-lg tracking-tight text-muted-foreground text-center pb-4'}>
				@ {interpreter.tournament.location}
			</p>
			<ResultDataTable
				// @ts-ignore
				teamData={teamData}
				eventData={eventData}
				trophies={interpreter.tournament.trophies}
			/>
		</>
	);
}
