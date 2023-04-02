import { FC, ReactNode } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { InputLimit } from 'components/strategies/create/BuySellBlock/InputLimit';
import { InputRange } from 'components/strategies/create/BuySellBlock/InputRange';
import { Token } from 'libs/tokens';

type Props = {
  base: Token;
  quote: Token;
  order: OrderCreate;
  title: ReactNode | string;
  inputTitle: ReactNode | string;
  buy?: boolean;
};

export const LimitRangeSection: FC<Props> = ({
  base,
  quote,
  order,
  title,
  inputTitle,
  buy,
}) => {
  const { isRange, setIsRange, resetFields } = order;

  const handleRangeChange = () => {
    setIsRange(!isRange);
    resetFields(true);
  };

  return (
    <div className={`space-y-12 text-left`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-18">{title}</div>
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
            sendEventOnMount={{ section: buy ? 'Buy Low' : 'Sell High' }}
            element={
              <>
                This section will define the order details in which you are
                willing to {buy ? 'buy' : 'sell'} {base.symbol} at.
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

      <div className={'flex items-center pt-10'}>{inputTitle}</div>

      {isRange ? (
        <InputRange
          min={order.min}
          setMin={order.setMin}
          max={order.max}
          setMax={order.setMax}
          error={order.rangeError}
          setRangeError={order.setRangeError}
          token={quote}
          buy={buy}
        />
      ) : (
        <InputLimit
          token={quote}
          price={order.price}
          setPrice={order.setPrice}
          error={order.priceError}
          setPriceError={order.setPriceError}
        />
      )}
    </div>
  );
};
