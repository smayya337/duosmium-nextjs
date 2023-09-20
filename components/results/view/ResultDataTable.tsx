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
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';
import * as React from 'react';
import { useEffect, useState } from 'react';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

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
		team.points = points + team.penalties;
	}
	recalculateRanks(teamData);
}

function recalculateRanks(
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
	const numbers = teamData.map((x) => x.number);
	numbers.sort((a, b) => {
		const teamA = teamData.find((x) => x.number === a);
		const teamB = teamData.find((x) => x.number === b);
		if (teamA?.points === teamB?.points) {
			return teamA?.penalties - teamB?.penalties;
		}
		return teamA?.points - teamB?.points;
	});
	for (const team of teamData) {
		team.rank = numbers.indexOf(team.number) + 1;
	}
}

// TODO: move tooltip to be by the actual badge, not over the table

function columnsFromEvents(
	eventData: any,
	trophies: number,
	tableData: Map<
		number,
		{ name: string; points: string; place: string; notes: string; medals: number }[]
	>,
	client: boolean
) {
	const tableDataMap = new Map(tableData);
	const output = [
		{
			accessorKey: 'number',
			// @ts-ignore
			header: ({ column }) => {
				return (
					<div
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className={'text-right'}
					>
						#
					</div>
				);
			},
			// @ts-ignore
			cell: ({ row }) => {
				const amount = row.getValue('number');
				return <div className="text-right text-muted-foreground">{amount}</div>;
			}
		},
		{
			accessorKey: 'team',
			// @ts-ignore
			header: ({ column }) => {
				return (
					<div
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className={'text-left'}
					>
						Team
					</div>
				);
			},
			// @ts-ignore
			cell: ({ row }) => {
				const num = row.getValue('number');
				const rowTableData = tableDataMap.get(num);
				const teamDataTeam = row.original;
				const teamName = (
					<div className="text-left whitespace-nowrap hover:cursor-pointer hover:underline">
						{/*@ts-ignore*/}
						{teamDataTeam.team}
						{/*@ts-ignore*/}
						<span className={'text-xs text-muted-foreground ml-1'}>({teamDataTeam.location})</span>
						{/*@ts-ignore*/}
						{teamDataTeam.disqualified && <DisqualifiedBadge className={undefined} />}
						{/*@ts-ignore*/}
						{teamDataTeam.exhibition && teamDataTeam.attended && (
							<ExhibitionBadge className={undefined} />
						)}
						{/*@ts-ignore*/}
						{teamDataTeam.exhibition && !teamDataTeam.attended && (
							<AbsentBadge className={undefined} />
						)}
					</div>
				);
				// @ts-ignore
				const CompatibleTeamDialog = React.forwardRef(({ onClick, href }, ref) => {
					return (
						<TeamDialog
							teamNumber={num}
							eventData={eventData}
							// @ts-ignore
							tableData={rowTableData}
							teamData={teamDataTeam}
						>
							{teamName}
						</TeamDialog>
					);
				});
				CompatibleTeamDialog.displayName = 'CompatibleTeamDialog';
				return client ? <CompatibleTeamDialog /> : teamName;
			}
		},
		{
			accessorKey: 'rank',
			// @ts-ignore
			header: ({ column }) => {
				return (
					<div
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className={'text-center'}
					>
						Overall
					</div>
				);
			},
			// @ts-ignore
			cell: ({ row }) => {
				const amount = row.getValue('rank');
				let cls = undefined;
				if (amount <= trophies) {
					cls = `place-${amount}`;
				}
				return <div className={cls}>{amount}</div>;
			}
		},
		{
			accessorKey: 'points',
			// @ts-ignore
			header: ({ column }) => {
				return (
					<div
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className={'text-center'}
					>
						Total
					</div>
				);
			},
			// @ts-ignore
			cell: ({ row }) => {
				const amount = row.getValue('points');
				return <div>{amount}</div>;
			}
		}
	];
	for (const evt of eventData) {
		output.push({
			accessorKey: evt.id,
			// @ts-ignore
			header: ({ column }) => {
				let cls = 'text-left whitespace-nowrap sideways py-1 w-5';
				// if (!evt.trial && !evt.trialed) {
				// 	cls += ' mx-px';
				// }
				return (
					<div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className={cls}>
						{evt.name}
						{evt.trial && <TrialBadge className={'mt-1 py-2.5 px-0.5'} />}
						{evt.trialed && <TrialedBadge className={'mt-1 py-2.5 px-0.5'} />}
					</div>
				);
			},
			// @ts-ignore
			cell: ({ row }) => {
				const amount = row.getValue(evt.id);
				let cls = 'w-5 flex flex-row justify-center';
				if (amount <= evt.medals) {
					cls += ` place-${amount}`;
				}
				return (
					<div className={cls}>
						{amount}
						{row.original[`${evt.id}-suptag`] ? (
							<div dangerouslySetInnerHTML={{ __html: row.original[`${evt.id}-suptag`] }} />
						) : null}
					</div>
				);
			}
		});
	}
	output.push({
		accessorKey: 'penalties',
		// @ts-ignore
		header: ({ column }) => {
			return (
				<div
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className={'text-left whitespace-nowrap sideways py-1 w-5'}
				>
					Team Penalties
				</div>
			);
		},
		// @ts-ignore
		cell: ({ row }) => {
			const amount = row.getValue('penalties');
			return <div className="text-muted-foreground">{amount}</div>;
		}
	});
	return output;
}

export function ResultDataTable<TData, TValue>({
	eventData,
	teamData,
	trophies,
	tableData
}: {
	eventData: TData[];
	teamData: TData[];
	trophies: number;
	tableData: Map<
		number,
		{ name: string; points: string; place: string; notes: string; medals: number }[]
	>;
}) {
	const [client, setClient] = useState(false);
	useEffect(() => setClient(true), []);
	const defaultActive = {};
	for (const e of eventData) {
		// @ts-ignore
		defaultActive[nameToKey(e.name)] = !(e.trial || e.trialed);
	}
	const [activeEvents] = useState(structuredClone(defaultActive));
	useEffect(() => {
		// @ts-ignore
		recalculatePoints(activeEvents, teamData);
	}, [activeEvents, teamData]);
	// @ts-ignore
	recalculatePoints(activeEvents, teamData);
	const columns: ColumnDef<TData, any>[] = columnsFromEvents(
		eventData,
		trophies,
		tableData,
		client
	);
	return <DataTable columns={columns} data={teamData} />;
}
function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		// getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting
		}
	});

	return (
		<div>
			<Table className={'text-center max-w-[90vw]'}>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										key={header.id}
										className={'align-bottom max-h-96 hover:cursor-pointer hover:underline px-2'}
									>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className={'p-2'}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center p-2">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
