import { FC, ReactNode } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { InputLimit } from 'components/strategies/create/BuySellBlock/InputLimit';
import { InputRange } from 'components/strategies/create/BuySellBlock/InputRange';
import { Token } from 'libs/tokens';

type Props = {
  token0: Token;
  token1: Token;
  order: OrderCreate;
  buy?: boolean;
  title: ReactNode | string;
  inputTitle: ReactNode | string;
  sectionTooltip: ReactNode | string;
};

export const LimitRangeSection: FC<Props> = ({
  token0,
  token1,
  order,
  buy,
  title,
  inputTitle,
  sectionTooltip,
}) => {
  const { isRange, setIsRange, resetFields } = order;

  const handleRangeChange = () => {
    setIsRange(!isRange);
    resetFields(true);
  };

  return (
    <div className={`space-y-12`}>
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
          <Tooltip element={sectionTooltip} />
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
          token={token0}
          buy={buy}
        />
      ) : (
        <InputLimit
          token={token1}
          price={order.price}
          setPrice={order.setPrice}
          error={order.priceError}
          setPriceError={order.setPriceError}
        />
      )}
    </div>
  );
};
