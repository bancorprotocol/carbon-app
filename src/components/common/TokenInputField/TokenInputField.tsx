import { ChangeEvent, FC, useRef } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
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
  slippage?: SafeDecimal | null;
  withoutWallet?: boolean;
  'data-testid'?: string;
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
  'data-testid': testid,
}) => {
  const { user } = useWeb3();
  const inputRef = useRef<HTMLInputElement>(null);
  const { getFiatValue, getFiatAsString } = useFiatCurrency(token);
  const fiatValueUsd = getFiatValue(value, true);

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
      const balanceValue = new SafeDecimal(balance).toFixed(token.decimals);
      setValue(balanceValue);
    }
    onKeystroke && onKeystroke();
  };

  const showFiatValue = fiatValueUsd.gt(0);

  return (
    <div
      className={`
        flex cursor-text flex-col gap-8 border border-black p-16
        focus-within:border-white/50
        ${isError ? '!border-red/50' : ''}
        ${className}
      `}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center justify-between">
        <input
          id={id}
          type="text"
          pattern={decimalNumberValidationRegex}
          inputMode="decimal"
          ref={inputRef}
          value={value}
          size={1}
          onChange={handleChange}
          placeholder={placeholder}
          onFocus={(e) => e.target.select()}
          className={`
            grow text-ellipsis bg-transparent text-18 font-weight-500 focus:outline-none
            ${isError ? 'text-red' : ''}
            ${disabled ? 'text-white/40' : ''}
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          disabled={disabled}
          data-testid={testid}
        />
        <div className="flex items-center gap-6 rounded-[20px] bg-emphasis py-6 px-8">
          <LogoImager alt="Token" src={token.logoURI} className="h-20 w-20" />
          <span className="font-weight-500">{token.symbol}</span>
        </div>
      </div>
      <div className="flex min-h-[16px] flex-wrap items-center justify-between gap-10 font-mono text-12 font-weight-500">
        <p className="flex items-center gap-5 text-white/60">
          {!slippage?.isZero() && showFiatValue && getFiatAsString(value)}
          {slippage && value && <Slippage slippage={slippage} />}
        </p>
        {user && isBalanceLoading !== undefined && !withoutWallet && (
          <button
            disabled={disabled}
            type="button"
            onClick={handleBalanceClick}
            className="group flex items-center"
          >
            Wallet:&nbsp;
            {isBalanceLoading ? (
              'loading'
            ) : (
              <>
                <span className="text-white">
                  {prettifyNumber(balance || 0)}&nbsp;
                </span>
                <b
                  className={
                    disabled
                      ? 'text-green/40'
                      : 'text-green group-hover:text-white'
                  }
                >
                  MAX
                </b>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
