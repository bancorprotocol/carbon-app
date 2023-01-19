import { ChangeEvent, FC } from 'react';
import { Token } from 'libs/tokens';
import { sanitizeNumberInput } from 'utils/helpers';

export const InputRange: FC<{
  buyToken: Token;
  sellToken: Token;
  min: string;
  setMin: (value: string) => void;
  max: string;
  setMax: (value: string) => void;
  error?: string;
  buy?: boolean;
  setRangeError: (error: string) => void;
}> = ({
  buyToken,
  sellToken,
  min,
  setMin,
  max,
  setMax,
  error,
  buy,
  setRangeError,
}) => {
  const handleChangeMin = (e: ChangeEvent<HTMLInputElement>) =>
    setMin(sanitizeNumberInput(e.target.value));

  const handleChangeMax = (e: ChangeEvent<HTMLInputElement>) =>
    setMax(sanitizeNumberInput(e.target.value));

  const handleBlur = (isMin?: boolean) => {
    Number(min) > 0 && (isMin || Number(max) > Number(min))
      ? setRangeError('')
      : setRangeError('Max Price must be higher than min price and not zero');
  };

  return (
    <div>
      <div className="flex space-x-6">
        <div
          className={`${
            error ? 'border border-error-500 text-error-500' : ''
          } bg-body w-full rounded-l-16 p-16`}
        >
          <input
            value={min}
            onChange={handleChangeMin}
            placeholder="Price"
            onBlur={() => handleBlur(true)}
            className={'w-full bg-transparent focus:outline-none'}
          />
          <div
            className={`mt-8 text-[12px] ${
              buy ? 'text-success-500' : 'text-error-500'
            }`}
          >
            Min {sellToken.symbol} per {buyToken.symbol}
          </div>
        </div>
        <div
          className={`${
            error ? 'border border-error-500 text-error-500' : ''
          } bg-body w-full rounded-r-16 p-16`}
        >
          <div>
            <input
              value={max}
              onChange={handleChangeMax}
              placeholder={`Price`}
              onBlur={() => handleBlur()}
              className={'w-full bg-transparent focus:outline-none'}
            />
            <div
              className={`mt-8 text-[12px] ${
                buy ? 'text-success-500' : 'text-error-500'
              }`}
            >
              Max {sellToken.symbol} per {buyToken.symbol}
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-5 text-center text-12 text-error-500">{error}</div>
      )}
    </div>
  );
};
