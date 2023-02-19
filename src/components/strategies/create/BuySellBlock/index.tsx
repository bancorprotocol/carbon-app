import { FC } from 'react';
import { Imager } from 'components/common/imager/Imager';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { InputLimit } from 'components/strategies/create/BuySellBlock/InputLimit';
import { InputRange } from 'components/strategies/create/BuySellBlock/InputRange';
import { Token } from 'libs/tokens';
import { UseQueryResult } from 'libs/queries';
import { TokenInputField } from 'components/common/TokenInputField';
import BigNumber from 'bignumber.js';

type Props = {
  token0: Token;
  token1: Token;
  tokenBalanceQuery: UseQueryResult<string>;
  order: OrderCreate;
  buy?: boolean;
};

export const BuySellBlock: FC<Props> = ({
  token0,
  token1,
  tokenBalanceQuery,
  order,
  buy,
}) => {
  const budgetToken = buy ? token1 : token0;
  const title = buy ? 'Buy Low' : 'Sell High';
  const tooltipText = `This section will define the order details in which you are willing to ${
    buy ? 'buy' : 'sell'
  } ${token0.symbol} at.`;

  const { isRange, setIsRange, resetFields } = order;
  const handleRangeChange = () => {
    setIsRange(!isRange);
    resetFields(true);
  };

  const insufficientBalance = new BigNumber(tokenBalanceQuery.data || 0).lt(
    order.budget
  );

  return (
    <div
      className={`bg-secondary space-y-12 rounded-10 border-l-2 p-20 pb-10 ${
        buy ? 'border-green/50' : 'border-red/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-18">
          <Tooltip element={tooltipText}>
            <span>{title}</span>
          </Tooltip>
          <Imager
            alt={'Token'}
            src={token0.logoURI}
            className={'mx-6 h-18 w-18 rounded-full'}
          />
          <span>{token0.symbol}</span>
        </div>
        <div className="flex items-center gap-10 text-14">
          <div className="bg-body flex items-center rounded-[100px] p-2">
            <button
              onClick={() => handleRangeChange()}
              className={`rounded-40 ${
                !isRange ? 'bg-silver' : 'text-secondary'
              } px-10 py-4`}
            >
              Limit
            </button>
            <button
              onClick={() => handleRangeChange()}
              className={`rounded-40 ${
                isRange ? 'bg-silver' : 'text-secondary'
              } px-10 py-4`}
            >
              Range
            </button>
          </div>
          <Tooltip
            element={
              <>
                This section will define the order details in which you are
                willing to {buy ? 'buy' : 'sell'} {token0.symbol} at.
                <br />
                <b>Limit</b> will allow you to define a specific price point to{' '}
                {buy ? 'buy' : 'sell'} the token at.
                <br />
                <b>Range</b> will allow you to define a range of prices to{' '}
                {buy ? 'buy' : 'sell'} the token at.
              </>
            }
          />
        </div>
      </div>

      <div className={'flex items-center pt-10'}>
        <div
          className={
            'mr-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px]'
          }
        >
          1
        </div>
        <Tooltip
          element={`Define the rate you are willing to ${
            buy ? 'buy' : 'sell'
          } ${token0.symbol} at. Make sure the price is in ${
            token1.symbol
          } tokens.`}
        >
          <div className={'text-14 font-weight-500 text-white/60'}>
            <span>Set {buy ? 'Buy' : 'Sell'} Price</span>
            <span className={'ml-8 text-white/80'}>
              ({token1.symbol} <span className={'text-white/60'}>per 1 </span>
              {token0.symbol})
            </span>
          </div>
        </Tooltip>
      </div>

      {isRange ? (
        <InputRange
          min={order.min}
          setMin={order.setMin}
          max={order.max}
          setMax={order.setMax}
          error={order.rangeError}
          setRangeError={order.setRangeError}
          token={token0}
          buy={buy}
        />
      ) : (
        <InputLimit
          token={token0}
          price={order.price}
          setPrice={order.setPrice}
          error={order.priceError}
          setPriceError={order.setPriceError}
        />
      )}

      <div className={'flex items-center pt-10'}>
        <div
          className={
            'mr-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px]'
          }
        >
          2
        </div>
        <Tooltip
          element={
            buy
              ? `The amount of ${token1.symbol} tokens you would like to use in order to buy ${token0.symbol}. Note: this amount will re-fill once the "Sell" order is used by traders.`
              : `The amount of ${token0.symbol} tokens you would like to sell. Note: this amount will re-fill once the "Buy" order is used by traders.`
          }
        >
          <div className={'text-14 font-weight-500 text-white/60'}>
            Set {buy ? 'Buy' : 'Sell'} Budget{' '}
          </div>
        </Tooltip>
      </div>
      <div>
        <TokenInputField
          className={'rounded-16 bg-black p-16'}
          value={order.budget}
          setValue={order.setBudget}
          token={budgetToken}
          isBalanceLoading={tokenBalanceQuery.isLoading}
          balance={tokenBalanceQuery.data}
          isError={insufficientBalance}
        />
        <div
          className={`mt-10 text-center text-12 text-red ${
            !insufficientBalance ? 'invisible' : ''
          }`}
        >
          Insufficient balance
        </div>
      </div>
    </div>
  );
};
