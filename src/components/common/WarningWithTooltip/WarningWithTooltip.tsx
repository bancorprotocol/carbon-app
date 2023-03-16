import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';

type WarningWithTooltipProps = {
  tooltipContent: string;
};

export const WarningWithTooltip = ({
  tooltipContent,
}: WarningWithTooltipProps) => {
  return (
    <span className={'ml-5 flex'}>
      <Tooltip interactive={false} element={tooltipContent}>
        <IconWarning className={'w-14 text-warning-500'} />
      </Tooltip>
    </span>
  );
};
