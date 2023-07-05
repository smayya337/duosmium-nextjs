import { InfoBadge } from '@/components/global/InfoBadge';

export function DisqualifiedBadge({ className, ref }: { className: string | undefined; ref: any }) {
	return (
		<InfoBadge
			label={'Disqualified'}
			info={'This team is ranked behind all other teams that were not disqualified.'}
			className={className}
			ref={ref}
		/>
	);
}
