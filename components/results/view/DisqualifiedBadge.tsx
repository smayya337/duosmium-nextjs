import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function DisqualifiedBadge({ className }: { className: string | undefined }) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge variant={'outline'} className={className}>
						Disqualified
					</Badge>
				</TooltipTrigger>
				<TooltipContent>
					<p>This team is ranked behind all other teams that were not disqualified.</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
