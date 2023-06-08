import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function TrialedBadge({ className }: { className: string | undefined }) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge variant={'outline'} className={className}>
						Trialed
					</Badge>
				</TooltipTrigger>
				<TooltipContent>
					<p>
						Placings in this event did not count towards total team score because of unforeseen
						circumstances during the competition.
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
