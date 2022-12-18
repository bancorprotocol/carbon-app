import { FC, useState } from 'react';
import { Imager } from 'elements/Imager';
import { prettifyNumber } from 'utils/helpers';
import { Tooltip } from 'components/Tooltip';
import { Token } from 'tokens';
import { Order } from 'elements/strategies/create/useOrder';

type Props = {
  source: Order;
  target: Order;
  buy?: boolean;
};

export const BuySellBlock: FC<Props> = ({ source, target, buy }) => {
  const [isRange, setIsRange] = useState(false);
  const order = buy ? source : target;
  const title = buy ? 'Buy' : 'Sell';

  const handleRangeChange = () => {
    setIsRange(!isRange);
    source.setMax('');
    source.setMin('');
    source.setPrice('');
  };

  //Impossible but TS doesnt recognize it
  if (!source.token || !target.token) return null;

  return (
    <div className={'bg-secondary space-y-10 rounded-10 p-20'}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-18">
          {title}{' '}
          <Imager
            alt={'Token'}
            src={buy ? source.token.logoURI : target.token.logoURI}
            className={'h-18 w-18 rounded-full'}
          />
        </div>

        <div className="flex items-center gap-10 text-14">
          <div className="bg-body flex items-center rounded-[100px] p-2">
            <button
              onClick={() => handleRangeChange()}
              className={`rounded-40 ${!isRange ? 'bg-silver' : ''} px-10 py-4`}
            >
              Limit
            </button>
            <button
              onClick={() => handleRangeChange()}
              className={`rounded-40 ${isRange ? 'bg-silver' : ''} px-10 py-4`}
            >
              Range
            </button>
          </div>
          <Tooltip>??????</Tooltip>
        </div>
      </div>

      {isRange ? (
        <InputRange
          buyToken={source.token}
          sellToken={target.token}
          min={order.min}
          setMin={order.setMin}
          max={order.max}
          setMax={order.setMax}
          error={order.rangeError}
        />
      ) : (
        <InputLimit
          buyToken={source.token}
          sellToken={target.token}
          price={order.price}
          setPrice={order.setPrice}
          error={order.priceError}
        />
      )}

      <BudgetInput
        title={title}
        budget={order.budget}
        setBudget={order.setBudget}
        buyToken={buy ? source.token : target.token}
        balance={order.balanceQuery.data}
        isBalanceLoading={order.balanceQuery.isLoading}
        error={order.budgetError}
      />
    </div>
  );
};

const InputLimit: FC<{
  buyToken: Token;
  sellToken: Token;
  price: string;
  setPrice: (value: string) => void;
  error?: string;
}> = ({ buyToken, sellToken, price, setPrice, error }) => {
  return (
    <div>
      <div
        className={`${
          error && 'border border-error-500 text-error-500'
        } bg-body rounded-16 p-16`}
      >
        <div className="mb-8 text-12 text-error-500">
          {sellToken.symbol} per {buyToken.symbol}
        </div>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder={`Amount (${sellToken.symbol})`}
          className={'w-full shrink bg-transparent focus:outline-none'}
        />
      </div>
      {error && (
        <div className="text-center text-12 text-error-500">{error}</div>
      )}
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
  error?: string;
}> = ({ buyToken, sellToken, min, setMin, max, setMax, error }) => {
  return (
    <div>
      <div className="flex gap-6">
        <div
          className={`${
            error && 'border border-error-500 text-error-500'
          } bg-body w-full rounded-14 rounded-r-0 p-16`}
        >
          <div className="mb-8 text-[11px] text-success-500">
            Min {sellToken.symbol} per {buyToken.symbol}
          </div>
          <input
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="Price"
            className={'w-full bg-transparent focus:outline-none'}
          />
        </div>
        <div
          className={`${
            error && 'border border-error-500 text-error-500'
          } bg-body w-full rounded-14 rounded-l-0 p-16`}
        >
          <div>
            <div className="mb-8 text-[11px] text-success-500">
              Max {sellToken.symbol} per {buyToken.symbol}
            </div>
            <input
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder={`Price`}
              className={'w-full bg-transparent focus:outline-none'}
            />
          </div>
        </div>
      </div>
      {error && (
        <div className="text-center text-12 text-error-500">{error}</div>
      )}
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
  error?: string;
}> = ({
  title,
  budget,
  setBudget,
  buyToken,
  balance,
  isBalanceLoading,
  error,
}) => {
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
          onChange={(e) => setBudget(e.target.value)}
          placeholder={`${title} Amount`}
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
