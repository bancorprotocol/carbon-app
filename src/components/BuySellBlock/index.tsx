import { FC, useState } from 'react';
import { Imager } from 'elements/Imager';
import { Tooltip } from 'components/Tooltip';
import { Order } from 'elements/strategies/create/useOrder';
import { BudgetInput } from './BudgetInput';
import { InputLimit } from './InputLimit';
import { InputRange } from './InputRange';

type Props = {
  source: Order;
  target: Order;
  buy?: boolean;
};

export const BuySellBlock: FC<Props> = ({ source, target, buy }) => {
  const [isRange, setIsRange] = useState(false);
  const order = buy ? source : target;
  const otherOrder = buy ? target : source;
  const title = buy ? 'Buy' : 'Sell';

  const handleRangeChange = () => {
    setIsRange(!isRange);
    if (buy) {
      source.setMax('');
      source.setMin('');
      source.setPrice('');
    } else {
      target.setMax('');
      target.setMin('');
      target.setPrice('');
    }
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
          buy={buy}
        />
      ) : (
        <InputLimit
          buyToken={source.token}
          sellToken={target.token}
          price={order.price}
          setPrice={order.setPrice}
          error={order.priceError}
          buy={buy}
        />
      )}

      <BudgetInput
        title={title}
        budget={order.budget}
        setBudget={order.setBudget}
        buyToken={buy ? target.token : source.token}
        balance={otherOrder.balanceQuery.data}
        isBalanceLoading={otherOrder.balanceQuery.isLoading}
        error={order.budgetError}
        setBudgetError={order.setBudgetError}
      />
    </div>
  );
};
