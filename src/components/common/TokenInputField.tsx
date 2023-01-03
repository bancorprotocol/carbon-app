import { Imager } from 'components/common/imager/Imager';
import { ChangeEvent, FC, useRef, useState } from 'react';
import { Token } from 'libs/tokens';
import { prettifyNumber, sanitizeNumberInput } from 'utils/helpers';

type Props = {
  value: string;
  setValue: (value: string) => void;
  token: Token;
  balance?: string;
  isBalanceLoading: boolean;
  setError?: (error: string) => void;
  error?: string | false;
  className?: string;
};

export const TokenInputField: FC<Props> = ({
  value,
  setValue,
  token,
  balance,
  isBalanceLoading,
  error,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNumberInput(e.target.value, token.decimals);
    setValue(sanitized);
  };

  return (
    <>
      <div className={'flex justify-between text-14'}>
        <div className={'text-white/50'}>Amount</div>
        <div className={'font-weight-500 text-error-500'}>{error}</div>
      </div>
      <div
        className={`cursor-text ${
          isFocused ? 'ring-2 ring-white/50' : ''
        } transition-all duration-200 ${
          error ? 'ring-2 ring-error-500/50' : ''
        } ${className}`}
        onClick={() => {
          inputRef.current?.focus();
        }}
      >
        <div className={`flex items-center justify-between`}>
          <div className={'flex items-center'}>
            <Imager
              alt={'Token'}
              src={token.logoURI}
              className={'mr-10 h-30 w-30 rounded-full'}
            />
            <span className={'font-weight-500'}>{token.symbol}</span>
          </div>
          <input
            ref={inputRef}
            value={!isFocused ? (!value ? '' : prettifyNumber(value)) : value}
            size={1}
            onChange={handleChange}
            placeholder={`enter amount`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full shrink bg-transparent text-right font-mono text-20 font-weight-500 focus:outline-none ${
              error ? 'text-error-500' : 'text-white'
            }`}
          />
        </div>

        <button
          onClick={() => balance && setValue(balance)}
          className={
            'text-secondary group mt-10 flex items-center p-5 font-mono !text-12 font-weight-600'
          }
        >
          Wallet:{' '}
          {isBalanceLoading || !balance ? 'loading' : prettifyNumber(balance)}{' '}
          <div className="ml-10 group-hover:text-white">MAX</div>
        </button>
      </div>
    </>
  );
};
