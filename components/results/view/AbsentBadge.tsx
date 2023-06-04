import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function AbsentBadge({ className }: { className: string | undefined }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={'outline'} className={className}>
            Absent
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>This team registered but did not compete, and so was treated as an exhibition team.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
