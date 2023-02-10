import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { Tooltip } from 'components/common/tooltip';

export const SuspiciousTokenWarning = () => {
  return (
    <span className={'ml-5 flex'}>
      <Tooltip element={<IconWarning className={'w-14 text-warning-500'} />}>
        This tokens is not part of any known token list. Always conduct your own
        research before trading.
      </Tooltip>
    </span>
  );
};
