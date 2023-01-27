import { ChangeEvent, FC } from 'react';
import { sanitizeNumberInput } from 'utils/helpers';

export const InputRange: FC<{
  min: string;
  setMin: (value: string) => void;
  max: string;
  setMax: (value: string) => void;
  error?: string;
  setRangeError: (error: string) => void;
}> = ({ min, setMin, max, setMax, error, setRangeError }) => {
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
            error ? 'border-2 border-red text-red' : ''
          } bg-body w-full rounded-r-4 rounded-l-16 p-16`}
        >
          <div className={'mb-5 text-12 text-white/60'}>Min</div>
          <input
            value={min}
            onChange={handleChangeMin}
            placeholder="Enter Price"
            onBlur={() => handleBlur(true)}
            className={
              'w-full bg-transparent font-mono text-18 font-weight-500 focus:outline-none'
            }
          />
        </div>
        <div
          className={`${
            error ? 'border-2 border-red text-red' : ''
          } bg-body w-full rounded-r-16 rounded-l-4 p-16`}
        >
          <div className={'mb-5 text-12 text-white/60'}>Max</div>
          <input
            value={max}
            onChange={handleChangeMax}
            placeholder={`Enter Price`}
            onBlur={() => handleBlur()}
            className={
              'w-full bg-transparent font-mono text-18 font-weight-500 focus:outline-none'
            }
          />
        </div>
      </div>
      {error && (
        <div className="mt-5 text-center text-12 text-red">{error}</div>
      )}
    </div>
  );
};
