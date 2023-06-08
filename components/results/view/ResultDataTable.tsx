'use client';

import { AbsentBadge } from '@/components/results/view/AbsentBadge';
import { DisqualifiedBadge } from '@/components/results/view/DisqualifiedBadge';
import { ExhibitionBadge } from '@/components/results/view/ExhibitionBadge';
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
import { teamAttended, teamLocation } from '@/lib/results/helpers';
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
import * as React from 'react';

function columnsFromEvents(eventData: any, trophies: number) {
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
				const amount = row.getValue('team');
				return (
					<div className="text-left whitespace-nowrap hover:cursor-pointer hover:underline">
						{amount}
						<span className={'text-xs text-muted-foreground ml-1'}>({row.original.location})</span>
						{row.original.disqualified && <DisqualifiedBadge className={'ml-1'} />}
						{row.original.exhibition && row.original.attended && (
							<ExhibitionBadge className={'ml-1'} />
						)}
						{row.original.exhibition && !row.original.attended && (
							<AbsentBadge className={'ml-1'} />
						)}
					</div>
				);
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
				return (
					<div
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className={'text-left whitespace-nowrap sideways py-1'}
					>
						{evt.name}
						{evt.trial && <TrialBadge className={'mb-1 py-2.5 px-0.5'} />}
						{evt.trialed && <TrialedBadge className={'mb-1 py-2.5 px-0.5'} />}
					</div>
				);
			},
			// @ts-ignore
			cell: ({ row }) => {
				const amount = row.getValue(evt.id);
				let cls = '';
				if (amount <= evt.medals) {
					cls = `place-${amount}`;
				}
				return <div className={cls}>{amount}</div>;
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

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function ResultDataTable<TData, TValue>({
	eventData,
	teamData,
	trophies
}: {
	eventData: TData[];
	teamData: TData[];
	trophies: number;
}) {
	const columns: ColumnDef<TData, any>[] = columnsFromEvents(eventData, trophies);
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
