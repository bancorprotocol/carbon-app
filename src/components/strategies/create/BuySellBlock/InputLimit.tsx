import BigNumber from 'bignumber.js';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';
import { ChangeEvent, FC, useMemo } from 'react';
import { getFiatValue, sanitizeNumberInput } from 'utils/helpers';

export const InputLimit: FC<{
  price: string;
  setPrice: (value: string) => void;
  token: Token;
  error?: string;
  setPriceError: (error: string) => void;
}> = ({ price, setPrice, token, error, setPriceError }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPrice(sanitizeNumberInput(e.target.value));

  const { selectedFiatCurrency, useGetTokenPrice } = useFiatCurrency();

  const tokenPriceQuery = useGetTokenPrice(token.symbol);

  const fiatValue = useMemo(
    () =>
      new BigNumber(price || 0).times(
        tokenPriceQuery.data?.[selectedFiatCurrency] || 0
      ),
    [price, selectedFiatCurrency, tokenPriceQuery.data]
  );

  return (
    <div className="">
      <div
        className={`${
          error && 'border-red/50 text-red'
        } bg-body flex flex-col items-end rounded-16 border-2 border-black p-16`}
      >
        <input
          value={price}
          onChange={handleChange}
          onBlur={() =>
            Number(price) > 0
              ? setPriceError('')
              : setPriceError('Price Must be greater than 0')
          }
          placeholder="Enter Price"
          className={
            'w-full bg-transparent text-end font-mono text-18 font-weight-500 focus:outline-none'
          }
        />
        <div className="font-mono text-12 text-white/60">
          {getFiatValue(fiatValue, selectedFiatCurrency)}
        </div>
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
