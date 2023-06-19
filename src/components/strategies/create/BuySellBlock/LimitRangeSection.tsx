import { FC, ReactNode, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Token } from 'libs/tokens';
import { useGetTokenPrice } from 'libs/queries';
import { Trans, useTranslation } from 'libs/translations';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { InputLimit } from 'components/strategies/create/BuySellBlock/InputLimit';
import { InputRange } from 'components/strategies/create/BuySellBlock/InputRange';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
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
};

export const LimitRangeSection: FC<Props> = ({
  base,
  quote,
  order,
  title,
  inputTitle,
  buy = false,
  isOrdersOverlap,
}) => {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const { isRange, setIsRange, resetFields } = order;
  const baseTokenPriceQuery = useGetTokenPrice(base?.address);
  const { getFiatValue, selectedFiatCurrency } = useFiatCurrency(quote);

  const overlappingOrdersPricesMessage = t('common.warnings.warning1');

  const warningMarketPriceMessage = buy
    ? t('common.warnings.warning2', { token: base.symbol })
    : t('common.warnings.warning3', { token: base.symbol });

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

  const isOrderAboveOrBelowMarketPrice = useMemo(() => {
    const tokenMarketPrice =
      baseTokenPriceQuery?.data?.[selectedFiatCurrency] || 0;

    if (order.isRange) {
      const isInputNotZero = buy
        ? new BigNumber(order.max).gt(0)
        : new BigNumber(order.min).gt(0);

      return (
        isInputNotZero &&
        new BigNumber(getFiatValue(buy ? order.max : order.min))[
          buy ? 'gt' : 'lt'
        ](tokenMarketPrice)
      );
    }
    return (
      new BigNumber(order.price).gt(0) &&
      new BigNumber(getFiatValue(order.price))[buy ? 'gt' : 'lt'](
        tokenMarketPrice
      )
    );
  }, [
    getFiatValue,
    order.price,
    order.isRange,
    order.max,
    order.min,
    baseTokenPriceQuery?.data,
    selectedFiatCurrency,
    buy,
  ]);

  return (
    <div className={`space-y-12 text-start`}>
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
              {t('common.actionButtons.actionButton7')}
            </button>
            <button
              tabIndex={-1}
              onClick={() => handleRangeChange()}
              className={`rounded-40 ${
                isRange ? 'bg-silver' : 'text-secondary'
              } px-10 py-4`}
            >
              {t('common.actionButtons.actionButton8')}
            </button>
          </div>
          <Tooltip
            sendEventOnMount={{ buy }}
            element={
              <Trans
                values={{ token: base.symbol }}
                i18nKey={
                  buy ? 'common.tooltips.tooltip1' : 'common.tooltips.tooltip2'
                }
                components={{
                  bold: <span className={'font-weight-500'} />,
                }}
              />
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
          buy={buy}
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
