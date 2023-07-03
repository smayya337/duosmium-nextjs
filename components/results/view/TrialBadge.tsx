import { InfoBadge } from '@/components/global/InfoBadge';

export function TrialBadge({ className }: { className: string | undefined }) {
	return (
		<InfoBadge
			label={'Trial'}
			info={'Placings in this event did not count towards total team score.'}
			className={className}
		/>
	);
}
