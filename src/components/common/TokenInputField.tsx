import { ChangeEvent, FC, useMemo, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Imager } from 'components/common/imager/Imager';
import { Token } from 'libs/tokens';
import {
  getFiatValue,
  prettifyNumber,
  sanitizeNumberInput,
} from 'utils/helpers';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { useWeb3 } from 'libs/web3';

type Props = {
  value: string;
  setValue: (value: string) => void;
  token: Token;
  placeholder?: string;
  balance?: string;
  isBalanceLoading?: boolean;
  isError?: boolean;
  className?: string;
  onKeystroke?: () => void;
  isLoading?: boolean;
  slippage?: BigNumber;
};

export const TokenInputField: FC<Props> = ({
  value,
  setValue,
  token,
  balance,
  isBalanceLoading,
  isError,
  className,
  onKeystroke,
  placeholder = 'Enter Amount',
  slippage,
}) => {
  const { user } = useWeb3();
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { selectedFiatCurrency, useGetTokenPrice } = useFiatCurrency();
  const tokenPriceQuery = useGetTokenPrice(token.symbol);
  const isSlippagePositive = slippage?.isGreaterThan(0);

  const fiatValue = useMemo(
    () =>
      new BigNumber(value || 0).times(
        tokenPriceQuery.data?.[selectedFiatCurrency] || 0
      ),
    [selectedFiatCurrency, tokenPriceQuery.data, value]
  );

  const handleOnFocus = () => {
    setIsFocused(true);
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
    balance && setValue(balance);
    onKeystroke && onKeystroke();
  };

  return (
    <div
      className={`cursor-text ${
        isFocused || isActive ? 'ring-2 ring-white/50' : ''
      } transition-all duration-200 ${
        isError ? 'ring-2 ring-red/50' : ''
      } ${className}`}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onClick={() => {
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
          />
        }
      </div>
      <div
        className={
          'text-secondary mt-10 flex items-center justify-between font-mono !text-12 font-weight-500'
        }
      >
        {user && isBalanceLoading !== undefined ? (
          <button
            onClick={handleBalanceClick}
            className={'group flex items-center'}
          >
            Wallet:{' '}
            {isBalanceLoading ? (
              'loading'
            ) : (
              <>
                {prettifyNumber(balance || 0)}{' '}
                <div className="ml-10 group-hover:text-white">MAX</div>
              </>
            )}
          </button>
        ) : (
          <div className={'h-16'} />
        )}
        <div className="flex">
          {fiatValue.gt(0) && (
            <div>{getFiatValue(fiatValue, selectedFiatCurrency)}</div>
          )}
          {slippage && !slippage.isNaN() && (
            <div
              className={`ml-4 ${
                isSlippagePositive ? 'text-green' : 'text-red'
              }`}
            >
              {`(${isSlippagePositive ? '+' : '-'}${sanitizeNumberInput(
                slippage.toString(),
                2
              )}%)`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
