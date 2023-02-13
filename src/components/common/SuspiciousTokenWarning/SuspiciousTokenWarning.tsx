import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';

export const SuspiciousTokenWarning = () => {
  return (
    <span className={'ml-5 flex'}>
      <Tooltip
        interactive={false}
        element="This token is not part of any known token list. Always conduct your own
        research before trading."
      >
        <IconWarning className={'w-14 text-warning-500'} />
      </Tooltip>
    </span>
  );
};
