import { InfoBadge } from '@/components/global/InfoBadge';

export function DisqualifiedBadge({ className }: { className: string | undefined }) {
	return (
		<InfoBadge
			label={'Disqualified'}
			info={'This team is ranked behind all other teams that were not disqualified.'}
			className={className}
		/>
	);
}
