import { Imager } from 'elements/Imager';
import { useSanitizeInput } from 'hooks/useSanitizeInput';
import { FC } from 'react';
import { Token } from 'tokens';
import { prettifyNumber } from 'utils/helpers';

export const BudgetInput: FC<{
  budget: string;
  setBudget: (value: string) => void;
  buyToken: Token;
  balance?: string;
  isBalanceLoading: boolean;
  setBudgetError: (error: string) => void;
  error?: string;
}> = ({
  budget,
  setBudget,
  buyToken,
  balance,
  isBalanceLoading,
  setBudgetError,
  error,
}) => {
  const handleChange = useSanitizeInput(setBudget);

  return (
    <div
      className={`${
        error && 'border border-error-500 text-error-500'
      } bg-body rounded-16 p-16`}
    >
      <div className={'mb-8 flex items-center gap-10'}>
        <div
          className={
            'bg-secondary flex flex-none items-center gap-6 rounded-full p-6 pr-10 text-white'
          }
        >
          <Imager
            alt={'Token'}
            src={buyToken.logoURI}
            className={'h-30 w-30 rounded-full'}
          />
          {buyToken.symbol}
        </div>
        <input
          value={budget}
          size={1}
          onChange={handleChange}
          onBlur={() =>
            setBudgetError(
              Number(budget) > Number(balance) ? 'Insufficient Balance' : ''
            )
          }
          placeholder={`Budget`}
          className={
            'w-full shrink bg-transparent text-right focus:outline-none'
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => balance && setBudget(balance)}
          className={'text-secondary flex items-center gap-5 !text-12'}
        >
          Wallet:{' '}
          {isBalanceLoading || !balance ? 'loading' : prettifyNumber(balance)}{' '}
          <div className="text-success-500">MAX</div>
        </button>
        {error && (
          <div className="text-center text-12 text-error-500">{error}</div>
        )}
      </div>
    </div>
  );
};
