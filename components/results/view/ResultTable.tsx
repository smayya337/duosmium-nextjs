'use client';

import { AbsentBadge } from '@/components/results/view/AbsentBadge';
import { DisqualifiedBadge } from '@/components/results/view/DisqualifiedBadge';
import { ExhibitionBadge } from '@/components/results/view/ExhibitionBadge';
import TeamDialog from '@/components/results/view/TeamDialog';
import { TrialBadge } from '@/components/results/view/TrialBadge';
import { TrialedBadge } from '@/components/results/view/TrialedBadge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { useEffect, useState } from 'react';

function nameToKey(name: string) {
	return name.toLowerCase().replaceAll(/\s+/g, '_').replaceAll(/\W/g, '');
}

function recalculatePoints(
	activeEvents: object,
	teamData: {
		number: any;
		team: string;
		school: any;
		suffix: any;
		location: string;
		disqualified: any;
		exhibition: any;
		attended: boolean | undefined;
		earnedBid: any;
		rank: any;
		points: any;
		penalties: any;
	}[]
) {
	for (const team of teamData) {
		let points = 0;
		for (const event of Object.keys(activeEvents)) {
			// @ts-ignore
			if (activeEvents[event]) {
				// @ts-ignore
				points += team[event];
			}
		}
		team.points = points;
	}
}

export function ResultTable({
	teamData,
	eventData,
	trophies,
	tableData,
	placingsByTeam
}: {
	teamData: {
		number: any;
		team: string;
		school: any;
		suffix: any;
		location: string;
		disqualified: any;
		exhibition: any;
		attended: boolean | undefined;
		earnedBid: any;
		rank: any;
		points: any;
		penalties: any;
	}[];
	eventData: { id: string; name: any; trial: any; trialed: any; medals: any }[];
	trophies: number;
	tableData: Map<
		number,
		{ name: string; points: string; place: string; notes: string; medals: number }[]
	>;
	placingsByTeam: object;
}) {
	const defaultActive = {};
	for (const e of eventData) {
		// @ts-ignore
		defaultActive[nameToKey(e.name)] = !(e.trial || e.trialed);
	}
	const [activeEvents] = useState(defaultActive);
	useEffect(() => {
		recalculatePoints(activeEvents, teamData);
	}, [activeEvents, teamData]);
	recalculatePoints(activeEvents, teamData);
	return (
		<Table className={'text-center'}>
			<TableHeader>
				<TableRow>
					<TableHead
						key={'number'}
						className={'text-right px-2 max-h-96 align-bottom hover:cursor-pointer hover:underline'}
					>
						#
					</TableHead>
					<TableHead
						key={'team'}
						className={'px-2 max-h-96 align-bottom hover:cursor-pointer hover:underline'}
					>
						Team
					</TableHead>
					<TableHead
						key={'rank'}
						className={
							'text-center px-2 max-h-96 align-bottom hover:cursor-pointer hover:underline'
						}
					>
						Overall
					</TableHead>
					<TableHead
						key={'points'}
						className={
							'text-center px-2 max-h-96 align-bottom hover:cursor-pointer hover:underline'
						}
					>
						Total
					</TableHead>
					{/*@ts-ignore*/}
					{eventData.map((e) => {
						return (
							<TableHead
								key={nameToKey(e.name)}
								className={
									'text-left whitespace-nowrap max-h-96 sideways align-top py-1 hover:cursor-pointer hover:underline px-2 w-[2.625rem]'
								}
							>
								{e.name}
								{e.trial && <TrialBadge className={'mt-1 py-2.5 px-0.5'} />}
								{e.trialed && <TrialedBadge className={'mt-1 py-2.5 px-0.5'} />}
							</TableHead>
						);
					})}
					<TableHead
						key={'penalties'}
						className={
							'text-left whitespace-nowrap px-2 max-h-96 sideways align-top py-1 hover:cursor-pointer hover:underline'
						}
					>
						Team Penalties
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{/*@ts-ignore*/}
				{teamData.map((x) => {
					const teamName = (
						<div>
							{x.team}
							{x.suffix ? ` ${x.suffix}` : ''}
							<span className={'text-xs text-muted-foreground ml-1'}>({x.location})</span>
						</div>
					);
					return (
						<TableRow key={x.number}>
							<TableCell
								key={'number'}
								className={
									'text-right text-muted-foreground hover:cursor-pointer hover:underline p-2'
								}
							>
								<TeamDialog
									teamNumber={x.number}
									eventData={eventData}
									// @ts-ignore
									tableData={tableData.get(x.number)}
									teamData={x}
								>
									<div>{x.number}</div>
								</TeamDialog>
							</TableCell>
							<TableCell
								key={'school'}
								className={'text-left whitespace-nowrap hover:cursor-pointer hover:underline p-2'}
							>
								<TeamDialog
									teamNumber={x.number}
									eventData={eventData}
									// @ts-ignore
									tableData={tableData.get(x.number)}
									teamData={x}
								>
									{teamName}
								</TeamDialog>
								{x.disqualified && <DisqualifiedBadge className={'ml-1'} />}
								{x.exhibition && x.attended && <ExhibitionBadge className={'ml-1'} />}
								{x.exhibition && !x.attended && <AbsentBadge className={'ml-1'} />}
							</TableCell>
							{x.rank <= trophies && (
								<TableCell key={'rank'} className={`place-${x.rank} p-2`}>
									{x.rank}
								</TableCell>
							)}
							{!(x.rank <= trophies) && (
								<TableCell key={'rank'} className={'p-2'}>
									{x.rank}
								</TableCell>
							)}
							<TableCell key={'points'} className={'p-2'}>
								{x.points}
							</TableCell>
							{eventData.map(
								(
									value: { id: string; name: any; trial: any; trialed: any; medals: any },
									index: number
								) => {
									// @ts-ignore
									const placing = placingsByTeam[x.number][index];
									if (placing <= value.medals) {
										return (
											<TableCell key={nameToKey(value.name)} className={`place-${placing} p-2`}>
												{placing}
											</TableCell>
										);
									} else {
										return (
											<TableCell key={nameToKey(value.name)} className={'p-2'}>
												{placing}
											</TableCell>
										);
									}
								}
							)}
							<TableCell key={'penalties'} className={'text-muted-foreground p-2'}>
								{x.penalties}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
