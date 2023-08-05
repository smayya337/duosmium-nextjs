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
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useEffect, useState } from 'react';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

// TODO: move tooltip to be by the actual badge, not over the table

// @ts-ignore
const CompatibleDisqualifiedBadge = React.forwardRef(({ onClick, href }, ref) => {
	return <DisqualifiedBadge className={'ml-1'} ref={ref} />;
});
CompatibleDisqualifiedBadge.displayName = 'CompatibleDisqualifiedBadge';

// @ts-ignore
const CompatibleAbsentBadge = React.forwardRef(({ onClick, href }, ref) => {
	return <AbsentBadge className={'ml-1'} ref={ref} />;
});
CompatibleAbsentBadge.displayName = 'CompatibleAbsentBadge';

// @ts-ignore
const CompatibleExhibitionBadge = React.forwardRef(({ onClick, href }, ref) => {
	return <ExhibitionBadge className={'ml-1'} ref={ref} />;
});
CompatibleExhibitionBadge.displayName = 'CompatibleExhibitionBadge';

// @ts-ignore
const CompatibleTrialBadge = React.forwardRef(({ onClick, href }, ref) => {
	return <TrialBadge className={'mt-1 py-2.5 px-0.5'} ref={ref} />;
});
CompatibleTrialBadge.displayName = 'CompatibleTrialBadge';

// @ts-ignore
const CompatibleTrialedBadge = React.forwardRef(({ onClick, href }, ref) => {
	return <TrialedBadge className={'mt-1 py-2.5 px-0.5'} ref={ref} />;
});
CompatibleTrialedBadge.displayName = 'CompatibleTrialedBadge';

function columnsFromEvents(
	eventData: any,
	trophies: number,
	tableData: Map<
		number,
		{ name: string; points: string; place: string; notes: string; medals: number }[]
	>,
	toOpen: number | undefined,
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
						{teamDataTeam.disqualified && <CompatibleDisqualifiedBadge />}
						{/*@ts-ignore*/}
						{teamDataTeam.exhibition && teamDataTeam.attended && <CompatibleExhibitionBadge />}
						{/*@ts-ignore*/}
						{teamDataTeam.exhibition && !teamDataTeam.attended && <CompatibleAbsentBadge />}
					</div>
				);
				// @ts-ignore
				const CompatibleTeamDialog = React.forwardRef(({ onClick, href }, ref) => {
					return (
						<TeamDialog
							teamNumber={num}
							open={toOpen === num}
							eventData={eventData}
							// @ts-ignore
							tableData={rowTableData}
							teamData={teamDataTeam}
							ref={ref}
						>
							{/*<Link href={`?team=${num}`} passHref legacyBehavior>*/}
							{teamName}
							{/*</Link>*/}
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
						{evt.trial && <CompatibleTrialBadge />}
						{evt.trialed && <CompatibleTrialedBadge />}
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
					className={'text-left whitespace-nowrap sideways py-1'}
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
	tableData,
	dialogToOpen
}: {
	eventData: TData[];
	teamData: TData[];
	trophies: number;
	tableData: Map<
		number,
		{ name: string; points: string; place: string; notes: string; medals: number }[]
	>;
	dialogToOpen: number | undefined;
}) {
	const [client, setClient] = useState(false);
	useEffect(() => setClient(true), []);
	const columns: ColumnDef<TData, any>[] = columnsFromEvents(
		eventData,
		trophies,
		tableData,
		dialogToOpen,
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
			<Table className={'text-center'}>
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
