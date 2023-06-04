// @ts-ignore
import { ResultTable } from '@/components/results/view/ResultTable';
import { getCurrentUserID } from '@/lib/auth/helpers';
import { colors } from '@/lib/colors/default';
import { getCompleteResult, resultExists } from '@/lib/results/async';
import {
	dateString,
	findBgColor,
	formatSchool,
	fullTournamentTitle,
	fullTournamentTitleShort,
	generateFilename,
	teamAttended,
	teamLocation
} from '@/lib/results/helpers';
import { getInterpreter } from '@/lib/results/interpreter';
import { cookies, headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Event, Team } from 'sciolyff/dist/src/interpreter/types';
// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import styles from './page.module.css';

async function getRequestedInterpreter(id: string) {
	if (!(await resultExists(id))) {
		notFound();
	}
	if (interpreter === null || generateFilename(interpreter) !== id) {
		const result = await getCompleteResult(id);
		interpreter = getInterpreter(result);
	}
	return interpreter;
}

function eventClassName(event: string) {
	return event
		.toLowerCase()
		.replaceAll(/\s+/g, '-')
		.replaceAll(/[^\w-]/g, '');
}

let interpreter: Interpreter = null;

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
	// @ts-ignore
	const bgColor = colors[await findBgColor(id)];
	// noinspection HtmlUnknownTarget
	return (
		<>
			<h1 className={"text-3xl tracking-tight font-bold text-center pb-4"}>{fullTournamentTitle(interpreter.tournament)}</h1>
			<p className={"text-lg tracking-tight text-muted-foreground text-center"}>{dateString(interpreter)}</p>
			<p className={"text-lg tracking-tight text-muted-foreground text-center pb-4"}>@ {interpreter.tournament.location}</p>
			<ResultTable interpreter={interpreter} />
		</>
		// <div className={styles.resultsWrapper}>
		// 	<div className={styles.resultsHeaderContainer} style={{ backgroundColor: bgColor }}>
		// 		<div className={styles.resultsHeader}>
		// 			<div className={styles.info}>
		// 				<h1>{fullTournamentTitle(interpreter.tournament)}</h1>
		// 				<p className={styles.date}>{dateString(interpreter)}</p>
		// 				<p className={styles.location}>@ {interpreter.tournament.location}</p>
		// 			</div>
		// 			<div className={styles.actions}>
		// 				<Link href="/results" className={styles.backButton}>
		// 					<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="48">
		// 						<path d="M480 898.63 157.37 576 480 253.37l47.978 47.739-240.586 240.826H802.63v68.13H287.392l240.586 240.587L480 898.63Z" />
		// 					</svg>
		// 				</Link>
		// 				<button type="button" className={styles.tuneButton}>
		// 					<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="48">
		// 						<path d="M425.565 941.5V711h65.5v83h353v65.5h-353v82h-65.5Zm-309.63-82V794h252.5v65.5h-252.5Zm187-168.87v-82h-187v-65.26h187v-84h65.5v231.26h-65.5Zm122.63-82v-65.26h418.5v65.26h-418.5Zm166-167.63V210.5h65.5v82h187V358h-187v83h-65.5Zm-475.63-83v-65.5h418.5V358h-418.5Z" />
		// 					</svg>
		// 				</button>
		// 				<button type="button" className={styles.printButton}>
		// 					<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="48">
		// 						<path d="M724.218 371.782H236.022v-162h488.196v162Zm10.836 198.87q13.316 0 23.033-9.672 9.717-9.673 9.717-22.958 0-13.196-9.672-23.033-9.673-9.837-23.078-9.837-13.315 0-23.032 9.837-9.718 9.837-9.718 23.033 0 13.196 9.718 22.913 9.717 9.717 23.032 9.717Zm-79.206 307.5v-178.13H304.152v178.13h351.696Zm68.37 66.935H236.022V765.022h-162V514q0-47.346 32.104-79.782t79.396-32.436h588.956q47.489 0 79.615 32.436 32.125 32.436 32.125 79.782v251.022h-162v180.065Z" />
		// 					</svg>
		// 				</button>
		// 				<button type="button" className={styles.shareButton}>
		// 					<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="48">
		// 						<path d="M726.986 981.5q-49.638 0-84.562-35.03-34.924-35.031-34.924-84.708 0-6.751 1.5-16.639 1.5-9.887 4.5-18.08L319.348 656.065q-15.718 17.718-38.518 28.576-22.8 10.859-46.723 10.859-49.836 0-84.722-34.938-34.885-34.938-34.885-84.576 0-49.638 34.885-84.562 34.886-34.924 84.722-34.924 23.923 0 45.723 9.359 21.8 9.358 39.518 27.076L613.5 323.957q-3-7.311-4.5-16.514-1.5-9.204-1.5-17.535 0-49.54 34.938-84.474 34.938-34.934 84.576-34.934 49.638 0 84.562 34.938t34.924 84.576q0 49.638-34.885 84.562-34.886 34.924-84.722 34.924-24.277 0-46.419-7.612-22.141-7.612-37.583-25.344L348.5 539.043q2.239 8.24 3.62 19.104 1.38 10.864 1.38 18.094 0 7.231-1.38 15.234-1.381 8.003-3.62 16.482l294.391 166.499q15.442-14.732 36.26-23.344 20.819-8.612 47.742-8.612 49.836 0 84.722 34.938 34.885 34.938 34.885 84.576 0 49.638-34.938 84.562T726.986 981.5Z" />
		// 					</svg>
		// 				</button>
		// 			</div>
		// 		</div>
		// 	</div>
		// 	<table className={styles.resultsTable}>
		// 		<colgroup className={styles.teamInfo}>
		// 			<col key="number" />
		// 			<col key="team" />
		// 			<col key="event-ranking" />
		// 			<col key="ranking" />
		// 			<col key="total" />
		// 		</colgroup>
		// 		<colgroup className={styles.eventInfo}>
		// 			{interpreter.events.map((value: Event) => {
		// 				return <col key={eventClassName(value.name)} />;
		// 			})}
		// 		</colgroup>
		// 		<thead className={styles.resultTableHeader}>
		// 			<tr>
		// 				<th className={styles.numberHeader}>#</th>
		// 				<th className={styles.teamHeader}>Team</th>
		// 				<th className={styles.eventPointsHeader}></th>
		// 				<th className={styles.rankHeader}>
		// 					<div>Overall</div>
		// 				</th>
		// 				<th className={styles.teamPointsHeader}>Total</th>
		// 				{interpreter.events.map((value: Event) => {
		// 					return (
		// 						<th key={eventClassName(value.name)} className={styles.eventHeader}>
		// 							<span className={styles.updatedEventDot} style={{ display: 'none' }}>
		// 								•{' '}
		// 							</span>
		// 							{value.name}
		// 							{value.trial && (
		// 								<span className={`${styles.badge} ${styles.badgeTrial}`}>
		// 									<small>T</small>
		// 								</span>
		// 							)}
		// 							{value.trialed && (
		// 								<span className={`${styles.badge} ${styles.badgeTrialed}`}>
		// 									<small>Td</small>
		// 								</span>
		// 							)}
		// 						</th>
		// 					);
		// 				})}
		// 				<th className={styles.eventHeader}>Team Penalties</th>
		// 			</tr>
		// 		</thead>
		// 		<tbody className={styles.resultTableBody}>
		// 			{interpreter.teams.map((value: Team) => {
		// 				return (
		// 					<tr key={value.number} className={styles.team}>
		// 						<td className={styles.teamNumber} style={{ color: bgColor }}>
		// 							{value.number}
		// 						</td>
		// 						<td className={styles.teamName}>
		// 							{formatSchool(value)}
		// 							{value.suffix ? ' ' + value.suffix : ''}
		// 							<small className={styles.teamLocation}>{teamLocation(value)}</small>
		// 							{value.disqualified && (
		// 								<span className={`${styles.badge} ${styles.badgeDisqualified}`}>
		// 									<small>Dq</small>
		// 								</span>
		// 							)}
		// 							{value.exhibition && teamAttended(value) && (
		// 								<span className={`${styles.badge} ${styles.badgeExhibition}`}>
		// 									<small>Ex</small>
		// 								</span>
		// 							)}
		// 							{value.exhibition && !teamAttended(value) && (
		// 								<span className={`${styles.badge} ${styles.badgeAbsent}`}>
		// 									<small>Ab</small>
		// 								</span>
		// 							)}
		// 						</td>
		// 						<td className={styles.eventPoints}></td>
		// 						<td className={styles.teamRank}>{value.rank}</td>
		// 						<td className={styles.teamPoints}>{value.points}</td>
		// 						{interpreter.events.map((event: Event) => {
		// 							return (
		// 								<td key={event.name} className={styles.teamPlacing}>
		// 									<div>{event.placingFor(value)?.isolatedPoints}</div>
		// 								</td>
		// 							);
		// 						})}
		// 						<td className={styles.teamPenalty}>
		// 							{penaltyPoints(value).toString().padStart(2, '0')}
		// 						</td>
		// 					</tr>
		// 				);
		// 			})}
		// 		</tbody>
		// 	</table>
		// </div>
	);
}
