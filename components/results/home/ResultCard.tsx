import styles from '@/app/results/page.module.css';
import { OfficialBadge } from '@/components/results/home/OfficialBadge';
import { PreliminaryBadge } from '@/components/results/home/PreliminaryBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { colors } from '@/lib/colors/material';
import { cacheCompleteResult } from '@/lib/results/async';
import { dateString, fullTournamentTitle } from '@/lib/results/helpers';
import { getInterpreter } from '@/lib/results/interpreter';
import { Result } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

export async function ResultCard({ meta }: { meta: Result }) {
	const tournamentTitle = meta.fullTitle;
	return (
		<Card className={'flex flex-col'}>
			<Link href={`/results/${meta.duosmiumId}`} className={'flex flex-grow flex-col'}>
				<CardHeader>
					<CardTitle className={'leading-tight hover:underline'}>{tournamentTitle}</CardTitle>
					<CardDescription>
						{meta.date} @ {meta.locationName}
					</CardDescription>
					<div className={'flex gap-x-2'}>
						{meta.official && <OfficialBadge className={undefined} />}
						{meta.preliminary && <PreliminaryBadge className={undefined} />}
					</div>
				</CardHeader>
				<CardContent className={'bg-no-repeat bg-center flex-grow'}>
					{/* TODO: center this within the container -- currently, it's aligned to the top */}
					<Image
						src={`${process.env.BASE_URL}${meta.logo}`}
						alt={`Logo for the ${tournamentTitle}`}
						width={1024}
						height={1024}
						className={'object-contain inset-0 m-auto'}
					/>
				</CardContent>
			</Link>
			<CardFooter>
				<Button asChild>
					<Link href={`/results/${meta.duosmiumId}`}>Full Results</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
