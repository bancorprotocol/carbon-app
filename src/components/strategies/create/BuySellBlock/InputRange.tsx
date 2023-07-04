import { ChangeEvent, FC, FocusEvent } from 'react';
import { carbonEvents } from 'services/events';
import { Token } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { MarketPriceIndication } from 'components/strategies/marketPriceIndication';
import { sanitizeNumberInput } from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { MarketPricePercentage } from 'components/strategies/marketPriceIndication/useMarketIndication';

type InputRangeProps = {
  min: string;
  setMin: (value: string) => void;
  max: string;
  setMax: (value: string) => void;
  token: Token;
  buy?: boolean;
  error?: string;
  setRangeError: (error: string) => void;
  marketPricePercentages: MarketPricePercentage;
};

export const InputRange: FC<InputRangeProps> = ({
  min,
  setMin,
  max,
  setMax,
  token,
  error,
  setRangeError,
  buy = false,
  marketPricePercentages,
}) => {
  const { t } = useTranslation();
  const errorMessage = t('common.errors.error1');

  const handleChangeMin = (e: ChangeEvent<HTMLInputElement>) => {
    setMin(sanitizeNumberInput(e.target.value));
    if (!max || (+e.target.value > 0 && +max > +e.target.value)) {
      setRangeError('');
    } else {
      carbonEvents.strategy.strategyErrorShow({
        buy,
        message: errorMessage,
      });
      setRangeError(errorMessage);
    }
  };

  const handleChangeMax = (e: ChangeEvent<HTMLInputElement>) => {
    setMax(sanitizeNumberInput(e.target.value));
    if (!min || (+e.target.value > 0 && +e.target.value > +min)) {
      setRangeError('');
    } else {
      carbonEvents.strategy.strategyErrorShow({
        buy,
        message: errorMessage,
      });
      setRangeError(errorMessage);
    }
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const { getFiatAsString } = useFiatCurrency(token);

  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        <div
          className={`${
            error ? 'border-red/50 text-red' : ''
          } bg-body w-full rounded-r-4 rounded-l-16 border-2 border-black p-16`}
        >
          <Tooltip
            sendEventOnMount={{ buy }}
            element={
              buy
                ? t('common.tooltips.tooltip4', { token: token.symbol })
                : t('common.tooltips.tooltip5', { token: token.symbol })
            }
          >
            <div className={'mb-5 text-12 text-white/60'}>
              {t('common.contents.content9')}
            </div>
          </Tooltip>
          <input
            type={'text'}
            pattern={decimalNumberValidationRegex}
            inputMode="decimal"
            value={min}
            onChange={handleChangeMin}
            placeholder={t('common.placeholders.placeholder1')}
            onFocus={handleFocus}
            className={
              'mb-5 w-full bg-transparent font-mono text-18 font-weight-500 focus:outline-none'
            }
          />
          <div className="flex flex-col items-start gap-4">
            <div className="break-all font-mono text-12 text-white/60">
              {getFiatAsString(min)}
            </div>
            <MarketPriceIndication
              marketPricePercentage={marketPricePercentages.min}
              isRange
            />
          </div>
        </div>
        <div
          className={`${
            error ? 'border-red/50 text-red' : ''
          } bg-body w-full rounded-r-16 rounded-l-4 border-2 border-black p-16`}
        >
          <Tooltip
            sendEventOnMount={{ buy }}
            element={
              buy
                ? t('common.tooltips.tooltip6', { token: token.symbol })
                : t('common.tooltips.tooltip7', { token: token.symbol })
            }
          >
            <div className={'mb-5 text-12 text-white/60'}>
              {t('common.contents.content10')}
            </div>
          </Tooltip>
          <input
            type={'text'}
            pattern={decimalNumberValidationRegex}
            inputMode="decimal"
            value={max}
            onChange={handleChangeMax}
            placeholder={t('common.placeholders.placeholder1')}
            onFocus={handleFocus}
            className={
              'mb-5 w-full bg-transparent font-mono text-18 font-weight-500 focus:outline-none'
            }
          />
          <div className="flex flex-col items-start gap-4">
            <div className="break-all font-mono text-12 text-white/60">
              {getFiatAsString(max)}
            </div>
            <MarketPriceIndication
              marketPricePercentage={marketPricePercentages.max}
              isRange
            />
          </div>
        </div>
      </div>
      <div
        className={`mt-10 flex h-16 items-center gap-10 text-start font-mono text-12 text-red ${
          !error ? 'invisible' : ''
        }`}
      >
        <IconWarning className="h-12 w-12" />
        <div>{error ? error : ''}</div>
      </div>
    </div>
  );
};
