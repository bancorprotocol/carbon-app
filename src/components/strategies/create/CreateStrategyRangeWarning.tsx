import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

export const CreateStrategyRangeWarning = () => {
  return (
    <div className={'flex items-center justify-center text-warning-500'}>
      <IconWarning className={'mr-10 w-12'} /> Only use range if you know what
      you are doing
    </div>
  );
};
