import { InfoBadge } from '@/components/global/InfoBadge';

export function TrialedBadge({ className }: { className: string | undefined }) {
	return (
		<InfoBadge
			label={'Trialed'}
			info={
				'Placings in this event did not count towards total team score because of unforeseen circumstances during the competition.'
			}
			className={className}
		/>
	);
}
