import { TrialBadge } from '@/components/results/view/TrialBadge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { formatSchool, teamAttended, teamLocation } from "@/lib/results/helpers";
// @ts-ignore
import Interpreter, { Team } from 'sciolyff/interpreter';
import { TrialedBadge } from "@/components/results/view/TrialedBadge";
import { ExhibitionBadge } from "@/components/results/view/ExhibitionBadge";
import { AbsentBadge } from "@/components/results/view/AbsentBadge";
import { DisqualifiedBadge } from "@/components/results/view/DisqualifiedBadge";

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
					<TableHead key={'number'} className={'text-right px-2 max-h-96 align-bottom hover:cursor-pointer hover:underline'}>
						#
					</TableHead>
					<TableHead key={'team'} className={'px-2 max-h-96 align-bottom hover:cursor-pointer hover:underline'}>Team</TableHead>
					<TableHead key={'rank'} className={'text-center px-2 max-h-96 align-bottom hover:cursor-pointer hover:underline'}>
						Overall
					</TableHead>
					<TableHead key={'points'} className={'text-center px-2 max-h-96 align-bottom hover:cursor-pointer hover:underline'}>
						Total
					</TableHead>
					{/*@ts-ignore*/}
					{eventNames.map((e) => {
						// @ts-ignore
						const evt = eventsByName[e];
						return (
							<TableHead key={nameToKey(e)} className={'text-left whitespace-nowrap px-2 max-h-96 sideways align-bottom py-1 hover:cursor-pointer hover:underline'}>
								{e}
								{evt.trial && <TrialBadge className={'mb-1 py-2.5 px-0.5'} />}
								{evt.trialed && (
									<TrialedBadge className={'mb-1 py-2.5 px-0.5'} />
								)}
							</TableHead>
						);
					})}
					<TableHead key={'penalties'} className={'text-left whitespace-nowrap px-2 max-h-96 sideways align-bottom py-1 hover:cursor-pointer hover:underline'}>
						Team Penalties
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
								className={'text-right text-muted-foreground hover:cursor-pointer hover:underline p-2'}
							>
								{t.number}
							</TableCell>
							<TableCell key={'school'} className={'text-left whitespace-nowrap hover:cursor-pointer hover:underline p-2'}>
								{formatSchool(t)}{t.suffix ? ` ${t.suffix}` : ''}
								<span className={'text-xs text-muted-foreground ml-1'}>({teamLocation(t)})</span>
								{t.disqualified && <DisqualifiedBadge className={'ml-1'} />}
								{t.exhibition && teamAttended(t) && <ExhibitionBadge className={'ml-1'} />}
								{t.exhibition && !teamAttended(t) && <AbsentBadge className={'ml-1'} />}
							</TableCell>
							{t.rank <= interpreter.tournament.trophies &&
								(
									<TableCell key={'rank'} className={`place-${t.rank} p-2`}>
										{t.rank}
									</TableCell>
								)}
							{!(
								t.rank <= interpreter.tournament.trophies
							) && <TableCell key={'rank'} className={'p-2'}>{t.rank}</TableCell>}
							<TableCell key={'points'} className={'p-2'}>{t.points}</TableCell>
							{eventNames.map((value: string, index: number) => {
								// @ts-ignore
								const placing = placingsByTeam[t.number][index];
								// @ts-ignore
								if ((placing <= eventsByName[value].medals || (eventsByName[value].medals === undefined && placing <= interpreter.tournament.medals))
								) {
									return (
										<TableCell key={nameToKey(value)} className={`place-${placing} p-2`}>{placing}</TableCell>
									);
								}
								else {
									return (
										<TableCell key={nameToKey(value)} className={'p-2'}>{placing}</TableCell>
									);
								}
							})}
							<TableCell key={'penalties'} className={'text-muted-foreground p-2'}>
								{totalPenalty(t)}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
