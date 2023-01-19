import { FC, useState } from 'react';
import { Imager } from 'components/common/imager/Imager';
import { Tooltip } from 'components/common/tooltip';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { BudgetInput } from 'components/strategies/create/BuySellBlock/BudgetInput';
import { InputLimit } from 'components/strategies/create/BuySellBlock/InputLimit';
import { InputRange } from 'components/strategies/create/BuySellBlock/InputRange';
import { Token } from 'libs/tokens';
import { UseQueryResult } from 'libs/queries';

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
  const [isRange, setIsRange] = useState(false);
  const title = buy ? 'Buy' : 'Sell';

  const handleRangeChange = () => {
    setIsRange(!isRange);
    order.resetFields(true);
  };

  return (
    <div className={'bg-secondary space-y-10 rounded-10 p-20'}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-18">
          <span>{title}</span>
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
          <Tooltip>??????</Tooltip>
        </div>
      </div>

      {isRange ? (
        <InputRange
          buyToken={token0}
          sellToken={token1}
          min={order.min}
          setMin={order.setMin}
          max={order.max}
          setMax={order.setMax}
          error={order.rangeError}
          buy={buy}
          setRangeError={order.setRangeError}
        />
      ) : (
        <InputLimit
          buyToken={token0}
          sellToken={token1}
          price={order.price}
          setPrice={order.setPrice}
          error={order.priceError}
          buy={buy}
          setPriceError={order.setPriceError}
        />
      )}

      <BudgetInput
        budget={order.budget}
        setBudget={order.setBudget}
        token={budgetToken}
        balance={tokenBalanceQuery.data}
        isBalanceLoading={tokenBalanceQuery.isLoading}
        error={order.budgetError}
        setBudgetError={order.setBudgetError}
      />
    </div>
  );
};
