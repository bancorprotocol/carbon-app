import { ChangeEvent, FC, FocusEvent } from 'react';
import { carbonEvents } from 'services/events';
import { Token } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { sanitizeNumberInput } from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

export const InputLimit: FC<{
  price: string;
  setPrice: (value: string) => void;
  token: Token;
  error?: string;
  setPriceError: (error: string) => void;
  buy?: boolean;
}> = ({ price, setPrice, token, error, setPriceError, buy = false }) => {
  const { t } = useTranslation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const errorMessage = t('common.errors.error2');
    +e.target.value > 0 ? setPriceError('') : setPriceError(errorMessage);

    if (+e.target.value > 0) {
      setPriceError('');
    } else {
      carbonEvents.strategy.strategyErrorShow({
        buy,
        message: errorMessage,
      });
      setPriceError(errorMessage);
    }
    setPrice(sanitizeNumberInput(e.target.value));
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const { getFiatAsString } = useFiatCurrency(token);
  const fiatAsString = getFiatAsString(price);

  return (
    <div>
      <div
        className={`${
          error && 'border-red/50 text-red'
        } bg-body flex flex-col items-end rounded-16 border-2 border-black p-16`}
      >
        <input
          type={'text'}
          pattern={decimalNumberValidationRegex}
          inputMode="decimal"
          value={price}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={t('common.placeholders.placeholder1')}
          className={
            'mb-5 w-full bg-transparent text-end font-mono text-18 font-weight-500 focus:outline-none'
          }
        />
        <div className="font-mono text-12 text-white/60">{fiatAsString}</div>
      </div>
      <div
        className={`mt-10 flex h-16 items-center gap-10 text-start font-mono text-12 text-red ${
          !error ? 'invisible' : ''
        }`}
      >
        <IconWarning className="h-12 w-12" />
        {error ? error : ''}
      </div>
    </div>
  );
};
