import { ChangeEvent, FC, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Token } from 'libs/tokens';
import { useWeb3 } from 'libs/web3';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { LogoImager } from 'components/common/imager/Imager';
import { Slippage } from './Slippage';
import { prettifyNumber, sanitizeNumberInput } from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';

type Props = {
  id?: string;
  value: string;
  setValue?: (value: string) => void;
  token: Token;
  placeholder?: string;
  balance?: string;
  isBalanceLoading?: boolean;
  isError?: boolean;
  className?: string;
  onKeystroke?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  slippage?: BigNumber | null;
  withoutWallet?: boolean;
};

export const TokenInputField: FC<Props> = ({
  id,
  value,
  setValue = () => {},
  token,
  balance,
  isBalanceLoading,
  isError,
  className,
  onKeystroke,
  placeholder = 'Enter Amount',
  disabled,
  slippage,
  withoutWallet,
}) => {
  const { user } = useWeb3();
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { getFiatValue, getFiatAsString } = useFiatCurrency(token);
  const fiatValueUsd = getFiatValue(value, true);

  const handleOnFocus = () => {
    inputRef.current?.select();
    !disabled && setIsFocused(true);
    if (value === '...') {
      setValue('');
    }
  };

  const handleOnBlur = () => {
    setIsFocused(false);
  };

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNumberInput(value, token.decimals);
    setValue(sanitized);
    onKeystroke && onKeystroke();
  };

  const handleBalanceClick = () => {
    if (balance === value) return;
    if (balance) {
      const balanceValue = new BigNumber(balance).toFixed(token.decimals);
      setValue(balanceValue);
    }
    onKeystroke && onKeystroke();
  };

  const showFiatValue = fiatValueUsd.gt(0);

  return (
    <div
      className={`flex cursor-text flex-col gap-8 p-16 ${
        isFocused || isActive ? 'ring-2 ring-white/50' : ''
      } transition-all duration-200 ${
        isError ? 'ring-2 ring-red/50' : ''
      } ${className}`}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => !disabled && setIsActive(false)}
      onFocus={handleOnFocus}
      onClick={() => {
        if (disabled) return;
        setIsFocused(true);
        inputRef.current?.focus();
      }}
    >
      <div className={`flex items-center justify-between`}>
        <input
          id={id}
          type="text"
          pattern={decimalNumberValidationRegex}
          inputMode="decimal"
          ref={inputRef}
          value={
            value === '...'
              ? value
              : !isFocused
              ? !value
                ? ''
                : !isActive
                ? value
                : value
              : value
          }
          size={1}
          onChange={handleChange}
          placeholder={placeholder}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          className={`grow bg-transparent font-mono text-18 font-weight-500 focus:outline-none ${
            isError ? 'text-red' : 'text-white'
          }`}
          disabled={disabled}
        />
        <div
          className={`flex items-center gap-6 rounded-[20px] bg-emphasis py-6 px-8`}
        >
          <LogoImager
            alt={'Token'}
            src={token.logoURI}
            className={'h-20 w-20'}
          />
          <span className={'font-weight-500'}>{token.symbol}</span>
        </div>
      </div>
      <div
        className={
          'text-secondary flex items-center justify-between gap-10 font-mono !text-12 font-weight-500'
        }
      >
        <p>
          {!slippage?.isEqualTo(0) && showFiatValue && (
            <span>{getFiatAsString(value)}</span>
          )}
          {slippage && value && <Slippage slippage={slippage} />}
        </p>
        {user && isBalanceLoading !== undefined && !withoutWallet ? (
          <button
            type="button"
            onClick={handleBalanceClick}
            className={'group flex items-center'}
          >
            Wallet:&nbsp;
            {isBalanceLoading ? (
              'loading'
            ) : (
              <>
                <span className="text-white">
                  {prettifyNumber(balance || 0)}&nbsp;
                </span>
                <b className="text-green group-hover:text-white">MAX</b>
              </>
            )}
          </button>
        ) : (
          <div className={'h-16'} />
        )}
      </div>
    </div>
  );
};
