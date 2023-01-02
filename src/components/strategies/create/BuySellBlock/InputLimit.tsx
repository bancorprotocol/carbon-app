import { ChangeEvent, FC } from 'react';
import { Token } from 'tokens';
import { sanitizeNumberInput } from 'utils/helpers';

export const InputLimit: FC<{
  buyToken: Token;
  sellToken: Token;
  price: string;
  setPrice: (value: string) => void;
  error?: string;
  buy?: boolean;
  setPriceError: (error: string) => void;
}> = ({ buyToken, sellToken, price, setPrice, error, buy, setPriceError }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPrice(sanitizeNumberInput(e.target.value));

  return (
    <div>
      <div
        className={`${
          error && 'border border-error-500 text-error-500'
        } bg-body rounded-16 p-16`}
      >
        <div
          className={`mb-8 text-12 ${
            buy ? 'text-success-500' : 'text-error-500'
          }`}
        >
          {sellToken.symbol} per {buyToken.symbol}
        </div>
        <input
          value={price}
          onChange={handleChange}
          onBlur={() =>
            Number(price) > 0
              ? setPriceError('')
              : setPriceError('Price Must be greater than 0')
          }
          placeholder="Price"
          className={'w-full shrink bg-transparent focus:outline-none'}
        />
      </div>
      {error && (
        <div className="text-center text-12 text-error-500">{error}</div>
      )}
    </div>
  );
};
