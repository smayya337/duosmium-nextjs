import { InfoBadge } from '@/components/global/InfoBadge';

export function PreliminaryBadge({ className, ref }: { className: string | undefined; ref: any }) {
	return (
		<InfoBadge
			label={'Preliminary'}
			info={'Results for this tournament have not been finalized and are subject to change.'}
			className={className}
			ref={ref}
		/>
	);
}
