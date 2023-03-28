import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';
import { ChangeEvent, FC, FocusEvent } from 'react';
import { sanitizeNumberInput } from 'utils/helpers';

export const InputLimit: FC<{
  price: string;
  setPrice: (value: string) => void;
  token: Token;
  error?: string;
  setPriceError: (error: string) => void;
}> = ({ price, setPrice, token, error, setPriceError }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    +e.target.value > 0
      ? setPriceError('')
      : setPriceError('Price Must be greater than 0');
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
          value={price}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="Enter Price"
          className={
            'mb-5 w-full bg-transparent text-end font-mono text-18 font-weight-500 focus:outline-none'
          }
        />
        <div className="font-mono text-12 text-white/60">{fiatAsString}</div>
      </div>
      <div
        className={`mt-10 h-16 text-center text-12 text-red ${
          !error ? 'invisible' : ''
        }`}
      >
        {error ? error : ''}
      </div>
    </div>
  );
};
