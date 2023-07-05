import { InfoBadge } from '@/components/global/InfoBadge';

export function TrialBadge({ className, ref }: { className: string | undefined; ref: any }) {
	return (
		<InfoBadge
			label={'Trial'}
			info={'Placings in this event did not count towards total team score.'}
			className={className}
			ref={ref}
		/>
	);
}
