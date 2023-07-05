import { InfoBadge } from '@/components/global/InfoBadge';

export function ExhibitionBadge({ className, ref }: { className: string | undefined; ref: any }) {
	return (
		<InfoBadge
			label={'Exhibition'}
			info={
				'Placings by this team did not affect the ranks of other teams (except in trial events).'
			}
			className={className}
			ref={ref}
		/>
	);
}
