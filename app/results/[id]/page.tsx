// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { getInterpreter } from '@/app/lib/results/interpreter';
import { getResult } from '@/app/lib/results/async';
import {
	dateString,
	formatSchool,
	fullTournamentTitle,
	fullTournamentTitleShort,
	objectToYAML,
	teamLocation
} from '@/app/lib/results/helpers';
import { Event, Placing, Team } from 'sciolyff/dist/src/interpreter/types';
import styles from './page.module.css';
import Link from 'next/link';

async function getRequestedInterpreter(id: string) {
	const result = await getResult(id);
	const yaml = objectToYAML(result);
	return getInterpreter(yaml);
}

function eventClassName(event: string) {
	return event
		.toLowerCase()
		.replaceAll(/\s+/g, '-')
		.replaceAll(/[^\w-]/g, '');
}

// @ts-ignore
export async function generateMetadata({ params }) {
	const id = params.id;
	const interpreter: Interpreter = await getRequestedInterpreter(id);
	return { title: `${fullTournamentTitleShort(interpreter.tournament)} | Duosmium Results` };
}

function penaltyPoints(team: Team): number {
	let total = 0;
	team.penalties?.forEach((x) => (total += x.points));
	return total;
}

// @ts-ignore
export default async function Page({ params }) {
	const id = params.id;
	const interpreter: Interpreter = await getRequestedInterpreter(id);
	// noinspection HtmlUnknownTarget
	return (
		<div className={styles.resultsWrapper}>
			<div className={styles.resultsHeaderContainer}>
				<div className={styles.resultsHeader}>
					<div className={styles.info}>
						<h1>{fullTournamentTitle(interpreter.tournament)}</h1>
						<p className={styles.date}>{dateString(interpreter)}</p>
						<p className={styles.location}>@ {interpreter.tournament.location}</p>
					</div>
					<div className={styles.actions}>
						<Link href="/results" className={styles.backButton}>
							<svg viewBox="0 0 24 24">
								<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
							</svg>
						</Link>
						<button type="button" className={styles.saveButton}>
							<svg viewBox="0 0 24 24">
								<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path>
							</svg>
						</button>
						<button type="button" className={styles.printButton}>
							<svg viewBox="0 0 24 24">
								<path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"></path>
							</svg>
						</button>
						<button type="button" className={styles.shareButton}>
							<svg viewBox="0 0 24 24">
								<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"></path>
							</svg>
						</button>
					</div>
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
						<th className={styles.rankHeader}>
							<div>Overall</div>
						</th>
						<th className={styles.teamPointsHeader}>Total</th>
						{interpreter.events.map((value: Event) => {
							return (
								<th key={eventClassName(value.name)} className={styles.eventHeader}>
									<span className={styles.updatedEventDot} style={{ display: 'none' }}>
										•{' '}
									</span>
									{value.name}
								</th>
							);
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
									return (
										<td key={placing.event?.name} className={styles.teamPlacing}>
											<div>{placing.isolatedPoints}</div>
										</td>
									);
								})}
								<td className={styles.teamPenalty}>
									{penaltyPoints(value).toString().padStart(2, '0')}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
