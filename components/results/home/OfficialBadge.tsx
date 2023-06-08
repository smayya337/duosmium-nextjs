import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function OfficialBadge({ className }: { className: string | undefined }) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge variant={'outline'} className={className}>
						Official
					</Badge>
				</TooltipTrigger>
				<TooltipContent>
					<p>
						This information was published on Duosmium by, or on behalf of, the tournament
						organizers.
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
