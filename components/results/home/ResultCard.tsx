import { getInterpreter } from '@/lib/results/interpreter';
import { colors } from '@/lib/colors/material';
import Link from 'next/link';
import styles from '@/app/results/page.module.css';
import { dateString, fullTournamentTitle } from '@/lib/results/helpers';
import Image from 'next/image';
import { Result } from '@prisma/client';
import { cacheCompleteResult } from '@/lib/results/async';

export async function ResultCard({ meta }: { meta: Result }) {
	const completeResult = await cacheCompleteResult(meta.duosmiumId);
	if (!completeResult) {
		return null;
	}
	const interpreter = getInterpreter(completeResult);
	return (
		<div className={'mdc-layout-grid__cell mdc-layout-grid__cell--span-3-desktop'}>
			<div
				className={'mdc-card'}
				style={{
					// @ts-ignore
					'--mdc-theme-primary': colors[meta.color],
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between'
				}}
			>
				<Link href={`/results/${meta.duosmiumId}`} style={{ textDecoration: 'none' }} tabIndex={-1}>
					<div className="mdc-card__primary-action" tabIndex={0}>
						<div className={'mdc-card__content'} style={{ padding: '1rem' }}>
							<h6
								className={'mdc-typography--headline6'}
								style={{ margin: 0, color: 'var(--mdc-theme-text-primary-on-background)' }}
							>
								{fullTournamentTitle(interpreter.tournament)}
							</h6>
							<p
								className={'mdc-typography--subtitle2'}
								style={{ margin: 0, color: 'var(--mdc-theme-text-secondary-on-background)' }}
							>
								{dateString(interpreter)}
							</p>
							<p
								className={'mdc-typography--subtitle2'}
								style={{ margin: 0, color: 'var(--mdc-theme-text-secondary-on-background)' }}
							>
								@ {interpreter.tournament.location}
							</p>
						</div>
						<div className={'mdc-card__media mdc-card__media--16-9'}>
							<div
								className={'mdc-card__media-content'}
								style={{
									backgroundRepeat: 'no-repeat',
									backgroundPosition: 'center',
									backgroundColor: 'var(--mdc-theme-surface)'
								}}
							>
								<Image
									src={`${process.env.BASE_URL}${meta.logo}`}
									alt={`Logo for the ${fullTournamentTitle(interpreter.tournament)}`}
									fill={true}
									style={{
										objectFit: 'contain',
										width: '100%',
										height: '100%',
										position: 'absolute',
										left: '0',
										right: '0',
										top: '0',
										bottom: '0'
									}}
								/>
							</div>
						</div>
						<div className="mdc-card__ripple" />
					</div>
				</Link>
				<div className="mdc-card__actions">
					<div className="mdc-card__action-buttons">
						{/*<button className="mdc-button mdc-card__action mdc-card__action--button">*/}
						{/*    <div className="mdc-button__ripple" />*/}
						{/*    <span className="mdc-button__label">Summary</span>*/}
						{/*</button>*/}
						<Link href={`/results/${meta.duosmiumId}`} tabIndex={-1}>
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
