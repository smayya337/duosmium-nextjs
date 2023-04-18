import { getInterpreter } from '@/app/lib/results/interpreter';
import { getCompleteResult } from '@/app/lib/results/async';
import {dateString, fullTournamentTitle} from '@/app/lib/results/helpers';
import { prisma } from '@/app/lib/global/prisma';
import { Suspense } from 'react';
import styles from './page.module.css';
import Image from "next/image";
import Link from "next/link";

// @ts-ignore
async function Card({ meta }) {
	const completeResult = await getCompleteResult(meta.duosmiumId);
	const interpreter = getInterpreter(completeResult);
	console.log(meta.duosmiumId);
	return (
		// @ts-ignore
		<div className="mdc-card" style={{ '--mdc-theme-primary': meta.color }}>
			<Link href={`/results/${meta.duosmiumId}`} className={styles.primaryCardLink}>
				<div className="mdc-card__primary-action" tabIndex={0}>
					<div className={`mdc-card__content ${styles.cardHeader}`}>
						<h6 className={`${styles.cardTitle} mdc-typography--headline6`}>{fullTournamentTitle(interpreter.tournament)}</h6>
						<p className={`${styles.cardDate} mdc-typography--subtitle1`}>{dateString(interpreter)}</p>
						<p className={`${styles.cardLocation} mdc-typography--subtitle1`}>@ {interpreter.tournament.location}</p>
					</div>
					<div className="mdc-card__media mdc-card__media--16-9">
						<div
							className={`mdc-card__media-content ${styles.mdcCard__mediaContent}`}>
							<Image src={meta.logo} alt={`Logo for the ${fullTournamentTitle(interpreter.tournament)}`} fill={true} className={styles.cardImage} />
						</div>
					</div>
					<div className="mdc-card__ripple" />
				</div>
			</Link>
			<div className="mdc-card__actions">
				<div className="mdc-card__action-buttons">
					<button className="mdc-button mdc-card__action mdc-card__action--button">
						<div className="mdc-button__ripple" />
						<span className="mdc-button__label">Summary</span>
					</button>
					<Link href={`/results/${meta.duosmiumId}`}>
						<button className="mdc-button mdc-card__action mdc-card__action--button" tabIndex={-1}>
							<div className="mdc-button__ripple" />
							<span className="mdc-button__label">Full Results</span>
						</button>
					</Link>
				</div>
				<div className="mdc-card__action-icons">
					<button className={`mdc-button mdc-button--unelevated ${styles.teamCountButton}`}>
						{/*<div className="mdc-button__ripple" />*/}
						<span className="mdc-button__label">
							{interpreter.tournament.nonExhibitionTeamsCount} Teams
						</span>
					</button>
				</div>
			</div>
		</div>
	);
}
export default async function Page() {
	const allResults = await prisma.result.findMany({
		orderBy: {
			duosmiumId: 'desc'
		}
	});
	return (
		<div className="results-index">
			<div className="mdc-layout-grid">
				<div className="mdc-layout-grid__inner">
					{allResults.map((r) => {
						return (
							// r.duosmiumId === '2019-06-01_nationals_c' &&
							<Suspense key={r.duosmiumId}>
								<div className="mdc-layout-grid__cell">
									{/* @ts-ignore */}
									<Card meta={r} />
								</div>
							</Suspense>
						);
					})}
				</div>
			</div>
		</div>
	);
}
