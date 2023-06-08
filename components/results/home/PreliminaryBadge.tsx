import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function PreliminaryBadge({ className }: { className: string | undefined }) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge variant={'outline'} className={className}>
						Preliminary
					</Badge>
				</TooltipTrigger>
				<TooltipContent>
					<p>Results for this tournament have not been finalized and are subject to change.</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
