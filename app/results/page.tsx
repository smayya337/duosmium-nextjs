import { getInterpreter } from '@/app/lib/results/interpreter';
import { dateString, fullTournamentTitle } from '@/app/lib/results/helpers';
import { cache, Suspense } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { getCompleteResult } from '@/app/lib/results/async';
import { getAllReadableResults } from '@/app/lib/results/filter';
import { getServerComponentSupabaseClient } from '@/app/lib/global/supabase';
import { cookies, headers } from 'next/headers';
import { getCurrentUserID } from '@/app/lib/auth/helpers';

// @ts-ignore
async function Card({ meta }) {
	const completeResult = await cacheCompleteResult(meta.duosmiumId);
	if (!completeResult) {
		return null;
	}
	const interpreter = getInterpreter(completeResult);
	return (
		<div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-3-desktop">
			<div
				className="mdc-card"
				style={{
					// @ts-ignore
					'--mdc-theme-primary': meta.color,
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between'
				}}
			>
				<Link href={`/results/${meta.duosmiumId}`} className={styles.primaryCardLink} tabIndex={-1}>
					<div className="mdc-card__primary-action" tabIndex={0}>
						<div className={`mdc-card__content ${styles.cardHeader}`}>
							<h6 className={`${styles.cardTitle} mdc-typography--headline6`}>
								{fullTournamentTitle(interpreter.tournament)}
							</h6>
							<p className={`${styles.cardDate} mdc-typography--subtitle1`}>
								{dateString(interpreter)}
							</p>
							<p className={`${styles.cardLocation} mdc-typography--subtitle1`}>
								@ {interpreter.tournament.location}
							</p>
						</div>
						<div className="mdc-card__media mdc-card__media--16-9">
							<div className={`mdc-card__media-content ${styles.mdcCard__mediaContent}`}>
								<Image
									src={`${process.env.BASE_URL}${meta.logo}`}
									alt={`Logo for the ${fullTournamentTitle(interpreter.tournament)}`}
									fill={true}
									className={styles.cardImage}
								/>
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
						<Link href={`/results/${meta.duosmiumId}`} tabIndex={-1}>
							<button className="mdc-button mdc-card__action mdc-card__action--button">
								<div className="mdc-button__ripple" />
								<span className="mdc-button__label">Full Results</span>
							</button>
						</Link>
					</div>
					<div className="mdc-card__action-icons">
						<button
							className={`mdc-button mdc-button--unelevated ${styles.teamCountButton}`}
							tabIndex={-1}
						>
							{/*<div className="mdc-button__ripple" />*/}
							<span className="mdc-button__label">
								{interpreter.tournament.nonExhibitionTeamsCount} Teams
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

// @ts-ignore
function CardFallback({ meta }) {
	const id = meta.id;
	return (
		<div className="mdc-layout-grid__cell">
			{/*@ts-ignore*/}
			<div className="mdc-card" style={{ '--mdc-theme-primary': '#1f1b35' }}>
				<Link href={`/results/${id}`} className={styles.primaryCardLink}>
					<div className="mdc-card__primary-action" tabIndex={0}>
						<div className={`mdc-card__content ${styles.cardHeader}`}>
							<h6
								className={`${styles.cardTitle} mdc-typography--headline6`}
								style={{ wordWrap: 'break-word' }}
							>
								Loading result {id}...
							</h6>
						</div>
						<div className="mdc-card__ripple" />
					</div>
				</Link>
				<div className="mdc-card__actions">
					<div className="mdc-card__action-buttons">
						<Link href={`/results/${id}`}>
							<button className="mdc-button mdc-card__action mdc-card__action--button">
								<div className="mdc-button__ripple" />
								<span className="mdc-button__label">Full Results</span>
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

const cacheCompleteResult = cache(async (id: string) => {
	return await getCompleteResult(id);
});

function preload(duosmiumID: string) {
	void cacheCompleteResult(duosmiumID);
}

export default async function Page() {
	const supabase = getServerComponentSupabaseClient(headers, cookies);
	const allResults = await getAllReadableResults(await getCurrentUserID(supabase), false, 24);
	for (const res of allResults) {
		preload(res.duosmiumId);
	}
	return (
		<div className="results-index">
			<div className="mdc-layout-grid">
				<div className="mdc-layout-grid__inner">
					{allResults.map((r) => {
						return (
							<Suspense key={r.duosmiumId} fallback={<CardFallback meta={{ id: r.duosmiumId }} />}>
								{/* @ts-ignore */}
								<Card meta={r} />
							</Suspense>
						);
					})}
				</div>
			</div>
		</div>
	);
}
