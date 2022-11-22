import { FC, ReactNode } from 'react';

export const AmountInputWithButtons: FC<{
  label: string | ReactNode;
  amount: string;
  setAmount: (value: string) => void;
}> = ({ label, amount, setAmount }) => {
  return (
    <div className={'flex items-center space-x-10'}>
      <div
        className={
          'bg-secondary flex h-30 w-30 flex-grow-0 items-center justify-center rounded-full'
        }
      >
        -
      </div>
      <div className={'flex-grow space-y-6 text-center'}>
        {typeof label === 'string' ? (
          <div className={'text-secondary text-12'}>{label}</div>
        ) : (
          label
        )}
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={'enter amount'}
          className={'w-full bg-transparent text-center font-weight-500'}
        />
      </div>
      <div
        className={
          'bg-secondary flex h-30 w-30 flex-grow-0 items-center justify-center rounded-full'
        }
      >
        +
      </div>
    </div>
  );
};
