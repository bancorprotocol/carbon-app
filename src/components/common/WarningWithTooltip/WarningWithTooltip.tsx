import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';

export const WarningWithTooltip = ({
  tooltipContent = 'This token is not part of any known token list. Always conduct your own research before trading.',
}) => {
  return (
    <span className={'ml-5 flex'}>
      <Tooltip interactive={false} element={tooltipContent}>
        <IconWarning className={'w-14 text-warning-500'} />
      </Tooltip>
    </span>
  );
};
