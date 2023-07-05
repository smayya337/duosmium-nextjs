import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function InfoBadge({
	label,
	info,
	className,
	ref
}: {
	label: string;
	info: string;
	className: string | undefined;
	ref: any;
}) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild ref={ref}>
					<Badge variant={'outline'} className={className}>
						{label}
					</Badge>
				</TooltipTrigger>
				<TooltipContent>
					<p>{info}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
