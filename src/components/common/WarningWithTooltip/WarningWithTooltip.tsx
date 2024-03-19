import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
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
    <Tooltip interactive={false} element={tooltipContent}>
      <span>
        <IconWarning className={cn('w-14 text-warning', className)} />
      </span>
    </Tooltip>
  );
};
