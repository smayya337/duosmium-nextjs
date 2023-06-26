import { InfoBadge } from "@/components/global/InfoBadge";

export function PreliminaryBadge({ className }: { className: string | undefined }) {
	return (
		<InfoBadge label={'Preliminary'} info={'Results for this tournament have not been finalized and are subject to change.'} className={className} />
	);
}
