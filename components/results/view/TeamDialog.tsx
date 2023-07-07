'use client';

import { TeamDialogTable } from '@/components/results/view/TeamDialogTable';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
// @ts-ignore
import { ordinalize, placingNotes } from '@/lib/results/helpers';
import Link from 'next/link';
import React from 'react';

export default function TeamDialog({
	teamNumber,
	open,
	tableData,
	teamData,
	children,
	// ref
}: {
	teamNumber: number;
	teamData: {
		number: any;
		team: string;
		school: string;
		suffix: string | undefined;
		location: string;
		disqualified: boolean;
		exhibition: boolean;
		attended: boolean | undefined;
		earnedBid: boolean;
		rank: number;
		points: number;
		penalties: number;
	};
	open: boolean;
	eventData: object[];
	tableData: { name: string; points: string; place: string; notes: string; medals: number }[];
	children: React.ReactNode;
	// ref: any;
}) {
	// TODO: make this open on click
	const formattedTeamName = `${teamData.school}${teamData.suffix ? ` ${teamData.suffix}` : ''} (${
		teamData.location
	})`;
	const formattedSchoolName = `${teamData.school} (${teamData.location})`;
	return (
		<Dialog open={open}>
			<DialogTrigger className={'w-full h-full'} asChild>
				{children}
			</DialogTrigger>
			<DialogContent className={'max-h-[90vh] overflow-y-auto'}>
				<DialogHeader>
					<DialogTitle>Information for Team {teamNumber}</DialogTitle>
					<DialogDescription>
						{formattedTeamName} placed {ordinalize(teamData.rank)} overall with a total score of{' '}
						{teamData.points} points.
					</DialogDescription>
				</DialogHeader>
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="item-1">
						<AccordionTrigger className={'py-2'}>Event Details</AccordionTrigger>
						<AccordionContent>
							<TeamDialogTable tableData={tableData} />
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				<DialogFooter className={'text-sm'}>
					<Link
						href={`/results/schools/${formattedSchoolName
							.charAt(0)
							.toLowerCase()}#${formattedSchoolName}`}
						className={'text-sky-700 dark:text-sky-500 hover:underline'}
					>
						View results for {formattedSchoolName} in other tournaments
					</Link>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
