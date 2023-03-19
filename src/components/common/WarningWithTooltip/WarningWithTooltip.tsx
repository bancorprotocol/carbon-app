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
    <span className={`flex ${className}`}>
      <Tooltip interactive={false} element={tooltipContent}>
        <IconWarning className={'w-14 text-warning-500'} />
      </Tooltip>
    </span>
  );
};
