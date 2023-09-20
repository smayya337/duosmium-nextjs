'use client';

import { AccordionContent } from '@/components/results/view/AccordionContentNoBottomPadding';
import { TeamDialogTable } from '@/components/results/view/TeamDialogTable';
import { Accordion, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
import { ordinalize } from '@/lib/results/helpers';
import Link from 'next/link';
import React from 'react';

export default function TeamDialog({
	teamNumber,
	tableData,
	teamData,
	children
}: // ref
{
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
	eventData: { id: string; name: any; trial: any; trialed: any; medals: any }[];
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
		<Dialog>
			<DialogTrigger className={'w-full h-full'} asChild>
				{children}
			</DialogTrigger>
			<DialogContent
				className={'max-h-[90vh] overflow-y-auto xs:max-w-[90vw] md:max-w-[75vw] xl:max-w-[40vw]'}
			>
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
				<DialogFooter className={'text-sm sm:justify-center'}>
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
