import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';

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
        <IconWarning className={`w-14 text-warning-500 ${className}`} />
      </span>
    </Tooltip>
  );
};
