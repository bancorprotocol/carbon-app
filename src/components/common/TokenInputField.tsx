import { ChangeEvent, FC, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Imager } from 'components/common/imager/Imager';
import { Token } from 'libs/tokens';
import { prettifyNumber, sanitizeNumberInput } from 'utils/helpers';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { useWeb3 } from 'libs/web3';

type Props = {
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
  const isSlippagePositive = slippage?.isGreaterThan(0);

  const { fiatValue, getFiatAsString } = useFiatCurrency(token, value);

  const handleOnFocus = () => {
    !disabled && setIsFocused(true);
  };

  const handleOnBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNumberInput(e.target.value, token.decimals);
    setValue(sanitized);
    onKeystroke && onKeystroke();
  };

  const handleBalanceClick = () => {
    balance && setValue(new BigNumber(balance).toFixed(token.decimals));
    onKeystroke && onKeystroke();
  };

  return (
    <div
      className={`cursor-text ${
        isFocused || isActive ? 'ring-2 ring-white/50' : ''
      } transition-all duration-200 ${
        isError ? 'ring-2 ring-red/50' : ''
      } ${className}`}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => !disabled && setIsActive(false)}
      onClick={() => {
        if (disabled) return;
        setIsFocused(true);
        inputRef.current?.focus();
      }}
    >
      <div className={`flex items-center justify-between`}>
        <div className={'mr-10 flex flex-none items-center'}>
          <Imager
            alt={'Token'}
            src={token.logoURI}
            className={'mr-10 h-30 w-30 rounded-full'}
          />
          <span className={'font-weight-500'}>{token.symbol}</span>
        </div>
        {
          <input
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
            className={`w-full shrink bg-transparent text-right font-mono text-18 font-weight-500 focus:outline-none ${
              isError ? 'text-red' : 'text-white'
            }`}
            disabled={disabled}
          />
        }
      </div>
      <div
        className={
          'text-secondary mt-10 flex items-center justify-between gap-10 font-mono !text-12 font-weight-500'
        }
      >
        {user && isBalanceLoading !== undefined && !withoutWallet ? (
          <button
            onClick={handleBalanceClick}
            className={'group flex items-center'}
          >
            Wallet:
            {isBalanceLoading ? (
              'loading'
            ) : (
              <>
                <span className="ml-5 text-white">
                  {prettifyNumber(balance || 0)}
                </span>
                <div className="ml-10 text-green group-hover:text-white">
                  MAX
                </div>
              </>
            )}
          </button>
        ) : (
          <div className={'h-16'} />
        )}
        <div className="flex truncate">
          {fiatValue.gt(0) && <div>{getFiatAsString(true)}</div>}
          {slippage && value && (
            <div
              className={`ml-4 ${
                slippage.isEqualTo(0)
                  ? 'text-white/80'
                  : isSlippagePositive
                  ? 'text-green'
                  : 'text-red'
              }`}
            >
              {`(${
                slippage.isEqualTo(0) ? '' : isSlippagePositive ? '+' : '-'
              }${sanitizeNumberInput(slippage.toString(), 2)}%)`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
