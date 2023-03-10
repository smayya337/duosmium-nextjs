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

// @ts-ignore
export default async function Page({ params }) {
	const id = params.id;
	const interpreter: Interpreter = await getRequestedInterpreter(id);
	return (
		<>
			<header className={styles.info}>
				<h1>{fullTournamentTitle(interpreter.tournament)}</h1>
				<p>{dateString(interpreter)} @ {interpreter.tournament.location}</p>
			</header>
			<table className={styles.resultsTable}>
				<thead className={styles.resultTableHeader}>
					<tr>
						<th className={styles.numberHeader}>#</th>
						<th className={styles.teamHeader}>Team</th>
						<th>Overall</th>
						<th>Total</th>
						{interpreter.events.map((value: Event, index: number) => {
							return <th key={eventClassName(value.name)} className={styles.eventHeader}>{value.name}</th>;
						})}
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
								<td className={styles.teamRank}>{value.rank}</td>
								<td className={styles.teamPoints}>{value.points}</td>
								{value.placings?.map((placing: Placing) => {
									return <td key={placing.event?.name} className={styles.teamPlacing}>{placing.isolatedPoints}</td>;
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</>
	);
}
