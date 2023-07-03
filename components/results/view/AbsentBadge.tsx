import { InfoBadge } from '@/components/global/InfoBadge';

export function AbsentBadge({ className }: { className: string | undefined }) {
	return (
		<InfoBadge
			label={'Absent'}
			info={'This team registered but did not compete, and so was treated as an exhibition team.'}
			className={className}
		/>
	);
}
