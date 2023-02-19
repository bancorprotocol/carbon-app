import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';
import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';
import { sanitizeNumberInput } from 'utils/helpers';

export const InputLimit: FC<{
  price: string;
  setPrice: (value: string) => void;
  token: Token;
  error?: string;
  setPriceError: (error: string) => void;
  focus?: boolean;
  setFocus?: Dispatch<SetStateAction<boolean>>;
}> = ({ price, setPrice, token, error, setPriceError, setFocus, focus }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPrice(sanitizeNumberInput(e.target.value));

  const { fiatAsString } = useFiatCurrency(token, price);

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
          onBlur={() => {
            Number(price) > 0
              ? setPriceError('')
              : setPriceError('Price Must be greater than 0');
            focus && setFocus && setFocus(false);
          }}
          onFocus={() => !focus && setFocus && setFocus(true)}
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
