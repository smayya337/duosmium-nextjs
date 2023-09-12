// @ts-ignore
import { ResultDataTable } from '@/components/results/view/ResultDataTable';
import { ResultTable } from '@/components/results/view/ResultTable';
import { colors } from '@/lib/colors/default';
import { getCompleteResult, getResult, resultExists } from '@/lib/results/async';
import { findBgColor } from '@/lib/results/color';
import {
	bidsSupTagNote,
	dateString,
	formatSchool,
	fullTournamentTitle,
	generateFilename,
	ordinalize,
	placingNotes,
	supTag,
	teamAttended,
	teamLocation
} from '@/lib/results/helpers';
import { getInterpreter } from '@/lib/results/interpreter';
import { Result } from '@prisma/client';
import { notFound } from 'next/navigation';
import * as React from 'react';
import { Team } from 'sciolyff/dist/src/interpreter/types';
// @ts-ignore
import Interpreter, { Placing, Tournament } from 'sciolyff/interpreter';

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
	try {
		const res: Result = await getResult(id);
		return { title: `${res.fullShortTitle} | Duosmium Results` };
	} catch (e) {
		notFound();
	}
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
			school: tm.school,
			suffix: tm.suffix,
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
			const pl = evt.placingFor(tm);
			// @ts-ignore
			data[className(evt.name)] = pl.isolatedPoints;
			// @ts-ignore
			data[`${className(evt.name)}-suptag`] = supTag(pl);
		}
		output.push(data);
	}
	return output;
}

function processPlacingData(interpreter: Interpreter, teamObj: Team) {
	const placingMap: Map<string, Map<string, string>> = new Map();
	for (const evt of interpreter.events) {
		const evtMap: Map<string, string> = new Map();
		const placing: Placing = evt.placingFor(teamObj);
		evtMap.set('points', placing.isolatedPoints.toString());
		evtMap.set('place', ordinalize(placing.place));
		evtMap.set('notes', placingNotes(placing));
		placingMap.set(evt.name, evtMap);
	}
	return placingMap;
}

function createTableData(placingData: Map<string, Map<string, string>>, eventData: object[]) {
	const tableData: {
		name: string;
		points: string;
		place: string;
		notes: string;
		medals: number;
	}[] = [];
	for (const evt of eventData) {
		// @ts-ignore
		const res: Map<string, string> = placingData.get(evt.name);
		const dataPoint: {
			name: string;
			points: string;
			place: string;
			notes: string;
			medals: number;
		} = {
			// @ts-ignore
			name: evt.name,
			// @ts-ignore
			points: res.get('points'),
			// @ts-ignore
			place: res.get('place'),
			// @ts-ignore
			notes: res.get('notes'),
			// @ts-ignore
			medals: evt.medals
		};
		tableData.push(dataPoint);
	}
	return tableData;
}

function createFootnotes(tournament: Tournament) {
	const footnotes: any[] = [];
	if (tournament.bids > 0) {
		footnotes.push(
			<p className="footnote">
				<sup>✧</sup>
				{bidsSupTagNote(tournament)}
			</p>
		);
	}
	if (tournament.exemptPlacings || tournament.worstPlacingsDropped) {
		footnotes.push(
			<p className="footnote">
				<sup>◊</sup>Result was not counted as part of total score
			</p>
		);
	}
	if (tournament.tiesOutsideOfMaximumPlaces) {
		footnotes.push(
			<p className="footnote">
				<sup>*</sup>Tied with another team
			</p>
		);
	}
	return footnotes;
}

// @ts-ignore
export default async function ResultView({
	data,
	team
}: {
	data: object;
	team: number | undefined;
}) {
	const interpreter: Interpreter = await getInterpreter(data);
	const eventData = processEventData(interpreter);
	const teamData = processTeamData(interpreter);
	const tableData: Map<
		number,
		{ name: string; points: string; place: string; notes: string; medals: number }[]
	> = new Map();
	for (const tm of interpreter.teams) {
		const placingData = processPlacingData(interpreter, tm);
		tableData.set(tm.number, createTableData(placingData, eventData));
	}
	const footnotes = createFootnotes(interpreter.tournament);
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
			{/*<ResultDataTable*/}
			{/*	// @ts-ignore*/}
			{/*	teamData={teamData}*/}
			{/*	eventData={eventData}*/}
			{/*	trophies={interpreter.tournament.trophies}*/}
			{/*	tableData={tableData}*/}
			{/*	dialogToOpen={team}*/}
			{/*/>*/}
			<ResultTable interpreter={interpreter} />
			<div>{footnotes}</div>
		</>
	);
}
