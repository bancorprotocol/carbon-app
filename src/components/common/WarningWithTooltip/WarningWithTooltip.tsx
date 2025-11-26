import IconWarning from 'assets/icons/warning.svg?react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { cn } from 'utils/helpers';

type WarningWithTooltipProps = {
  tooltipContent: string;
  className?: string;
};

export const WarningWithTooltip = ({
  tooltipContent,
  className = '',
}: WarningWithTooltipProps) => {
  return (
    <Tooltip element={tooltipContent}>
      <IconWarning className={cn('text-warning w-14', className)} />
    </Tooltip>
  );
};
