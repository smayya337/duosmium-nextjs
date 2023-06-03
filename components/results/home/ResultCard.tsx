import styles from '@/app/results/page.module.css';
import { colors } from '@/lib/colors/material';
import { cacheCompleteResult } from '@/lib/results/async';
import { dateString, fullTournamentTitle } from '@/lib/results/helpers';
import { getInterpreter } from '@/lib/results/interpreter';
import { Result } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export async function ResultCard({ meta }: { meta: Result }) {
	const completeResult = await cacheCompleteResult(meta.duosmiumId);
	if (!completeResult) {
		return null;
	}
	const interpreter = getInterpreter(completeResult);
	const tournamentTitle = fullTournamentTitle(interpreter.tournament);
	return (
		<Card className={"flex flex-col"}>
			<Link href={`/results/${meta.duosmiumId}`} className={"flex flex-grow flex-col"}>
				<CardHeader>
					<CardTitle className={"leading-tight"}>{tournamentTitle}</CardTitle>
					<CardDescription>{dateString(interpreter)} @ {interpreter.tournament.location}</CardDescription>
					<div className={"flex gap-x-2"}>
						{meta.official && <Badge variant={"outline"}>Official</Badge>}
						{meta.preliminary && <Badge variant={"outline"}>Preliminary</Badge>}
					</div>
				</CardHeader>
				<CardContent className={"bg-no-repeat bg-center flex-grow"}>
					<Image src={`${process.env.BASE_URL}${meta.logo}`} alt={`Logo for the ${tournamentTitle}`} width={1024} height={1024} className={"object-contain inset-0 m-auto"} />
				</CardContent>
			</Link>
			{/*<div className={"flex-grow"}></div>*/}
			<CardFooter>
				<Button asChild><Link href={`/results/${meta.duosmiumId}`}>Full Results</Link></Button>
			</CardFooter>
		</Card>
	);
}
