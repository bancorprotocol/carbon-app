import { FC, useState } from 'react';
import { Imager } from 'elements/Imager';
import { prettifyNumber } from 'utils/helpers';
import { Tooltip } from 'components/Tooltip';
import { Token } from 'tokens';

type Props = {
  title: string;
  price: string;
  setPrice: (value: string) => void;
  budget: string;
  setBudget: (value: string) => void;
  min: string;
  setMin: (value: string) => void;
  max: string;
  setMax: (value: string) => void;
  buyToken: Token;
  sellToken: Token;
  balance?: string;
  isBalanceLoading: boolean;
};

export const BuySellBlock: FC<Props> = ({
  title,
  price,
  setPrice,
  budget,
  setBudget,
  min,
  setMin,
  max,
  setMax,
  buyToken,
  sellToken,
  balance,
  isBalanceLoading,
}) => {
  const [isRange, setIsRange] = useState(true);

  return (
    <div className={'bg-secondary space-y-10 rounded-18 p-20'}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-18">
          {title}{' '}
          <Imager
            alt={'Token'}
            src={buyToken.logoURI}
            className={'h-18 w-18 rounded-full'}
          />
        </div>

        <div className="flex items-center gap-10">
          Limit, Range
          <Tooltip>??????</Tooltip>
        </div>
      </div>

      {isRange ? (
        <InputRange
          buyToken={buyToken}
          sellToken={sellToken}
          min={min}
          setMin={setMin}
          max={max}
          setMax={setMax}
        />
      ) : (
        <InputLimit
          buyToken={buyToken}
          sellToken={sellToken}
          price={price}
          setPrice={setPrice}
        />
      )}

      <BudgetInput
        title={title}
        budget={budget}
        setBudget={setBudget}
        buyToken={buyToken}
        balance={balance}
        isBalanceLoading={isBalanceLoading}
      />
    </div>
  );
};

const InputLimit: FC<{
  buyToken: Token;
  sellToken: Token;
  price: string;
  setPrice: (value: string) => void;
}> = ({ buyToken, sellToken, price, setPrice }) => {
  return (
    <div className={'bg-body rounded-14 p-16'}>
      <div className="mb-8 text-12 text-error-500">
        {sellToken.symbol} per {buyToken.symbol}
      </div>
      <input
        value={price}
        size={1}
        onChange={(e) => setPrice(e.target.value)}
        placeholder={`Amount (${sellToken.symbol})`}
        className={'w-full shrink bg-transparent focus:outline-none'}
      />
    </div>
  );
};

const InputRange: FC<{
  buyToken: Token;
  sellToken: Token;
  min: string;
  setMin: (value: string) => void;
  max: string;
  setMax: (value: string) => void;
}> = ({ buyToken, sellToken, min, setMin, max, setMax }) => {
  return (
    <div className="flex gap-6">
      <div className={'bg-body w-full rounded-14 rounded-r-0 p-16'}>
        <div className="mb-8 text-[11px] text-success-500">
          Min {sellToken.symbol} per {buyToken.symbol}
        </div>
        <input
          value={min}
          size={1}
          onChange={(e) => setMin(e.target.value)}
          placeholder="Price"
          className={'w-full bg-transparent focus:outline-none'}
        />
      </div>
      <div className={'bg-body w-full rounded-14 rounded-l-0 p-16'}>
        <div>
          <div className="mb-8 text-[11px] text-success-500">
            Max {sellToken.symbol} per {buyToken.symbol}
          </div>
          <input
            value={max}
            size={1}
            onChange={(e) => setMax(e.target.value)}
            placeholder={`Price`}
            className={'w-full bg-transparent focus:outline-none'}
          />
        </div>
      </div>
    </div>
  );
};

const BudgetInput: FC<{
  title: string;
  budget: string;
  setBudget: (value: string) => void;
  buyToken: Token;
  balance?: string;
  isBalanceLoading: boolean;
}> = ({ title, budget, setBudget, buyToken, balance, isBalanceLoading }) => {
  return (
    <div className={'bg-body rounded-14 p-16'}>
      <div className={'mb-8 flex items-center gap-10'}>
        <div
          className={
            'bg-secondary flex flex-none items-center gap-6 rounded-full p-6 pr-10'
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
          onChange={(e) => setBudget(e.target.value)}
          placeholder={`${title} Amount`}
          className={
            'w-full shrink bg-transparent text-right focus:outline-none'
          }
        />
      </div>
      <div
        className={'text-secondary flex items-center justify-between !text-12'}
      >
        <div className={'flex items-center gap-5 '}>
          Wallet:{' '}
          {isBalanceLoading || !balance ? 'loading' : prettifyNumber(balance)}{' '}
          <div className="text-success-500">MAX</div>
        </div>
        <div>$100.000.000</div>
      </div>
    </div>
  );
};
