import { ChangeEvent, FC } from 'react';
import { sanitizeNumberInput } from 'utils/helpers';

export const InputLimit: FC<{
  price: string;
  setPrice: (value: string) => void;
  error?: string;
  setPriceError: (error: string) => void;
}> = ({ price, setPrice, error, setPriceError }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPrice(sanitizeNumberInput(e.target.value));

  return (
    <div className="">
      <div
        className={`${
          error && 'border-red/50 text-red'
        } bg-body rounded-16 border-2 border-black p-16`}
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
