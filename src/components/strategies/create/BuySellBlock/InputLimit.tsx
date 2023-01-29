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
    <div>
      <div
        className={`${
          error && 'border-2 border-red text-red'
        } bg-body rounded-16 p-16`}
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
            'w-full bg-transparent font-mono text-18 font-weight-500 focus:outline-none'
          }
        />
      </div>
      {error && (
        <div className="mt-5 text-center text-12 text-red">{error}</div>
      )}
    </div>
  );
};
