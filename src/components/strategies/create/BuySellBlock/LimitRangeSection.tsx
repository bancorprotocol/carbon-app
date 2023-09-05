import { FC, ReactNode } from 'react';
import { Token } from 'libs/tokens';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { InputLimit } from 'components/strategies/create/BuySellBlock/InputLimit';
import { InputRange } from 'components/strategies/create/BuySellBlock/InputRange';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import { useMarketIndication } from 'components/strategies/marketPriceIndication/useMarketIndication';
import { lsService } from 'services/localeStorage';
import { useModal } from 'hooks/useModal';

type Props = {
  base: Token;
  quote: Token;
  order: OrderCreate;
  title: ReactNode | string;
  inputTitle: ReactNode | string;
  buy?: boolean;
  isOrdersOverlap: boolean;
  isEdit?: boolean;
};

export const LimitRangeSection: FC<Props> = ({
  base,
  quote,
  order,
  title,
  inputTitle,
  buy = false,
  isOrdersOverlap,
  isEdit,
}) => {
  const { openModal } = useModal();
  const { isRange, setIsRange, resetFields } = order;
  const { marketPricePercentage, isOrderAboveOrBelowMarketPrice } =
    useMarketIndication({ base, quote, order, buy });

  const overlappingOrdersPricesMessage =
    'Notice: your Buy and Sell orders overlap';

  const warningMarketPriceMessage = buy
    ? `Notice, you offer to buy ${base.symbol} above current market price`
    : `Notice, you offer to sell ${base.symbol} below current market price`;

  const handleRangeChange = () => {
    if (!lsService.getItem('hasSeenCreateStratExpertMode')) {
      openModal('createStratExpertMode', {
        onConfirm: () => {
          setIsRange(!isRange);
          resetFields(true);
        },
      });
    } else {
      setIsRange(!isRange);
      resetFields(true);
    }
  };

  return (
    <div className={`space-y-12 text-left`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-18">{title}</div>
        <div className="flex items-center gap-10 text-14">
          <div className="bg-body flex items-center rounded-[100px] p-2">
            <button
              tabIndex={-1}
              onClick={() => handleRangeChange()}
              className={`rounded-40 ${
                !isRange ? 'bg-silver' : 'text-secondary'
              } px-10 py-4`}
            >
              Limit
            </button>
            <button
              tabIndex={-1}
              onClick={() => handleRangeChange()}
              className={`rounded-40 ${
                isRange ? 'bg-silver' : 'text-secondary'
              } px-10 py-4`}
            >
              Range
            </button>
          </div>
          <Tooltip
            sendEventOnMount={{ buy }}
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
          marketPricePercentages={marketPricePercentage}
        />
      ) : (
        <InputLimit
          token={quote}
          price={order.price}
          setPrice={order.setPrice}
          error={isEdit ? undefined : order.priceError}
          setPriceError={order.setPriceError}
          buy={buy}
          marketPricePercentage={marketPricePercentage}
        />
      )}
      {isOrdersOverlap && !buy && (
        <WarningMessageWithIcon
          message={overlappingOrdersPricesMessage}
          className="!mt-4"
        />
      )}
      {isOrderAboveOrBelowMarketPrice && (
        <WarningMessageWithIcon
          message={warningMarketPriceMessage}
          className="!mt-4"
        />
      )}
    </div>
  );
};
