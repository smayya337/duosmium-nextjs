// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { getInterpreter } from '@/app/lib/results/interpreter';
import { getResult } from '@/app/lib/results/async';
import {
	dateString,
	formatSchool,
	fullTournamentTitle,
	fullTournamentTitleShort,
	objectToYAML, teamLocation
} from "@/app/lib/results/helpers";
import { Event, Placing, Team } from 'sciolyff/dist/src/interpreter/types';
import styles from './page.module.scss';
import Link from "next/link";

async function getRequestedInterpreter(id: string) {
	const result = await getResult(id);
	const yaml = objectToYAML(result);
	return getInterpreter(yaml);
}

function eventClassName(event: string) {
	return event.toLowerCase().replaceAll(/\s+/g, '-').replaceAll(/[^\w-]/g, '');
}

// @ts-ignore
export async function generateMetadata({ params }) {
	const id = params.id;
	const interpreter: Interpreter = await getRequestedInterpreter(id);
	return { title: `${fullTournamentTitleShort(interpreter.tournament)} | Duosmium Results` };
}

function penaltyPoints(team: Team): number {
	let total = 0;
	team.penalties?.forEach((x) => total += x.points);
	return total;
}

// @ts-ignore
export default async function Page({ params }) {
	const id = params.id;
	const interpreter: Interpreter = await getRequestedInterpreter(id);
	return (
		<div className={styles.resultsWrapper}>
			<div className={styles.resultsHeaderContainer}>
				<div className={styles.resultsHeader}>
					<div className={styles.info}>
						<h1>{fullTournamentTitle(interpreter.tournament)}</h1>
						<p className={styles.date}>{dateString(interpreter)}</p>
						<p className={styles.location}>@ {interpreter.tournament.location}</p>
					</div>
					{/*<div className={styles.actions}>*/}
					{/*	<Link href="/results">Back</Link>*/}
					{/*	<p>Save PDF</p>*/}
					{/*	<p>Print</p>*/}
					{/*	<p>Share</p>*/}
					{/*</div>*/}
				</div>
			</div>
			<table className={styles.resultsTable}>
				<colgroup className={styles.teamInfo}>
					<col key="number" />
					<col key="team" />
					<col key="event-ranking" />
					<col key="ranking" />
					<col key="total" />
				</colgroup>
				<colgroup className={styles.eventInfo}>
					{interpreter.events.map((value: Event) => {
						return <col key={eventClassName(value.name)} />;
					})}
				</colgroup>
				<thead className={styles.resultTableHeader}>
					<tr>
						<th className={styles.numberHeader}>#</th>
						<th className={styles.teamHeader}>Team</th>
						<th className={styles.eventPointsHeader}></th>
						<th className={styles.rankHeader}><div>Overall</div></th>
						<th className={styles.teamPointsHeader}>Total</th>
						{interpreter.events.map((value: Event, index: number) => {
							return <th key={eventClassName(value.name)} className={styles.eventHeader}>{value.name}</th>;
						})}
						<th className={styles.eventHeader}>Team Penalties</th>
					</tr>
				</thead>
				<tbody className={styles.resultTableBody}>
					{interpreter.teams.map((value: Team) => {
						return (
							<tr key={value.number} className={styles.team}>
								<td className={styles.teamNumber}>{value.number}</td>
								<td className={styles.teamName}>
									{formatSchool(value)}
									{value.suffix ? ' ' + value.suffix : ''}
									<small className={styles.teamLocation}>{teamLocation(value)}</small>
								</td>
								<td className={styles.eventPoints}></td>
								<td className={styles.teamRank}>{value.rank}</td>
								<td className={styles.teamPoints}>{value.points}</td>
								{value.placings?.map((placing: Placing) => {
									return <td key={placing.event?.name} className={styles.teamPlacing}>
										<div>{placing.isolatedPoints}</div>
									</td>;
								})}
								<td className={styles.teamPenalty}>{penaltyPoints(value).toString().padStart(2, "0")}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
