import { ChangeEvent, FC, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Token } from 'libs/tokens';
import { i18n, useTranslation } from 'libs/translations';
import { useWeb3 } from 'libs/web3';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Imager } from 'components/common/imager/Imager';
import { Slippage } from './Slippage';
import { prettifyNumber, sanitizeNumberInput } from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';

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
  placeholder = i18n.t('common.placeholders.placeholder2'),
  disabled,
  slippage,
  withoutWallet,
}) => {
  const { t } = useTranslation();
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
      className={`cursor-text ${
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
        <div className={'flex flex-none items-center me-10'}>
          <Imager
            alt={'Token'}
            src={token.logoURI}
            className={'h-30 w-30 rounded-full me-10'}
          />
          <span className={'font-weight-500'}>{token.symbol}</span>
        </div>
        {
          <input
            type={'text'}
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
            className={`w-full shrink bg-transparent text-end font-mono text-18 font-weight-500 focus:outline-none ${
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
            tabIndex={-1}
            onClick={handleBalanceClick}
            className={'group flex items-center'}
          >
            {t('common.contents.content1')}
            {isBalanceLoading ? (
              t('common.contents.content3')
            ) : (
              <>
                <span className="text-white ms-5">
                  {prettifyNumber(balance || 0)}
                </span>
                <div className="text-green ms-10 group-hover:text-white">
                  {t('common.contents.content3')}
                </div>
              </>
            )}
          </button>
        ) : (
          <div className={'h-16'} />
        )}
        <div className="flex">
          {!slippage?.isEqualTo(0) && showFiatValue && (
            <div>{getFiatAsString(value)}</div>
          )}
          {slippage && value && <Slippage slippage={slippage} />}
        </div>
      </div>
    </div>
  );
};
