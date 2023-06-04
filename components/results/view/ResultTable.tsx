import { TrialBadge } from '@/components/results/view/TrialBadge';
import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { trophyAndMedalColors } from '@/lib/colors/default';
import { formatSchool, teamLocation } from '@/lib/results/helpers';
// @ts-ignore
import Interpreter, { Team } from 'sciolyff/interpreter';
import { TrialedBadge } from "@/components/results/view/TrialedBadge";

function nameToKey(name: string) {
	return name.toLowerCase().replaceAll(' ', '-');
}

function totalPenalty(t: Team) {
	return (
		t.penalties
			// @ts-ignore
			.map((p) => p.points)
			.reduce((partialSum: number, a: number) => partialSum + a, 0)
	);
}

export function ResultTable({ interpreter }: { interpreter: Interpreter }) {
	const eventNames: string[] = [];
	// @ts-ignore
	eventNames.push(...interpreter.events.filter((e) => !e.trial).map((e) => e.name));
	// @ts-ignore
	eventNames.push(...interpreter.events.filter((e) => e.trial).map((e) => e.name));
	const eventsByName = {};
	for (const e of interpreter.events) {
		// @ts-ignore
		eventsByName[e.name] = e;
	}
	const placingsByTeam = {};
	for (const t of interpreter.teams) {
		const placings: number[] = [];
		// @ts-ignore
		for (const e of eventNames) {
			// @ts-ignore
			placings.push(t.placingFor(eventsByName[e])?.isolatedPoints);
		}
		// @ts-ignore
		placingsByTeam[t.number] = placings;
	}
	return (
		<Table className={'text-center'}>
			<TableHeader>
				<TableRow>
					<TableHead key={'number'} className={'text-right'}>
						#
					</TableHead>
					<TableHead key={'team'}>Team</TableHead>
					<TableHead key={'rank'} className={'text-center'}>
						Overall
					</TableHead>
					<TableHead key={'points'} className={'text-center'}>
						Total
					</TableHead>
					{/*@ts-ignore*/}
					{eventNames.map((e) => {
						// @ts-ignore
						const evt = eventsByName[e];
						return (
							<TableHead key={nameToKey(e)} className={'text-center whitespace-nowrap'}>
								{e}
								{evt.trial && <TrialBadge className={'my-1'} />}
								{evt.trialed && (
									<TrialedBadge className={'my-1'} />
								)}
							</TableHead>
						);
					})}
					<TableHead key={'penalties'} className={'text-center'}>
						Penalties
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{/*@ts-ignore*/}
				{interpreter.teams.map((t) => {
					return (
						<TableRow key={t.number}>
							<TableCell
								key={'number'}
								className={'text-right text-muted-foreground hover:underline'}
							>
								{t.number}
							</TableCell>
							<TableCell key={'school'} className={'text-left whitespace-nowrap hover:underline'}>
								{formatSchool(t)}
								<span className={'text-xs'}> ({teamLocation(t)})</span>
							</TableCell>
							{t.rank <= interpreter.tournament.trophies &&
								(
									<TableCell key={'rank'} className={`place-${t.rank}`}>
										{t.rank}
									</TableCell>
								)}
							{!(
								t.rank <= interpreter.tournament.trophies
							) && <TableCell key={'rank'}>{t.rank}</TableCell>}
							<TableCell key={'points'}>{t.points}</TableCell>
							{eventNames.map((value: string, index: number) => {
								// @ts-ignore
								const placing = placingsByTeam[t.number][index];
								// @ts-ignore
								if ((placing <= eventsByName[value].medals || (eventsByName[value].medals === undefined && placing <= interpreter.tournament.medals))
								) {
									return (
										<TableCell key={nameToKey(value)} className={`place-${placing}`}>{placing}</TableCell>
									);
								}
								else {
									return (
										<TableCell key={nameToKey(value)}>{placing}</TableCell>
									);
								}
							})}
							<TableCell key={'penalties'} className={'text-muted-foreground'}>
								{totalPenalty(t)}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
