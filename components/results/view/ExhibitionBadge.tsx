import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ExhibitionBadge({ className }: { className: string | undefined }) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge variant={'outline'} className={className}>
						Exhibition
					</Badge>
				</TooltipTrigger>
				<TooltipContent>
					<p>
						Placings by this team did not affect the ranks of other teams (except in trial events).
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
