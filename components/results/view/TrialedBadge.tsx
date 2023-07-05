import { InfoBadge } from '@/components/global/InfoBadge';

export function TrialedBadge({ className, ref }: { className: string | undefined; ref: any }) {
	return (
		<InfoBadge
			label={'Trialed'}
			info={
				'Placings in this event did not count towards total team score because of unforeseen circumstances during the competition.'
			}
			className={className}
			ref={ref}
		/>
	);
}
