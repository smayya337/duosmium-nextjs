import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function TrialBadge({ className }: { className: string | undefined }) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge variant={'outline'} className={className}>
						Trial
					</Badge>
				</TooltipTrigger>
				<TooltipContent>
					<p>Placings in this event did not count towards total team score.</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
