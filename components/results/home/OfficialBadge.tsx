import { InfoBadge } from "@/components/global/InfoBadge";

export function OfficialBadge({ className }: { className: string | undefined }) {
	return (
		<InfoBadge label={'Official'} info={'This information was published on Duosmium by, or on behalf of, the tournament organizers.'} className={className} />
	);
}
