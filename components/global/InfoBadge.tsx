import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function InfoBadge({ label, info, className }: { label: string, info: string, className: string | undefined }) {
  // TODO: in the results view, the tooltip is not showing, and (if trial/ed) the column gets slightly wider for no reason
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
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
