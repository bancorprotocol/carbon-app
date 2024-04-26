import { ChangeEvent, FC, FocusEvent, useRef } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { useWeb3 } from 'libs/web3';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { LogoImager } from 'components/common/imager/Imager';
import { Slippage } from './Slippage';
import {
  prettifyNumber,
  formatNumber,
  sanitizeNumber,
  cn,
} from 'utils/helpers';
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
  required?: boolean;
};

export const TokenInputField: FC<Props> = (props) => {
  const {
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
  } = props;
  const { user } = useWeb3();
  const inputRef = useRef<HTMLInputElement>(null);
  const { getFiatValue, getFiatAsString } = useFiatCurrency(token);
  const fiatValueUsd = getFiatValue(value, true);

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNumber(value, token.decimals);
    setValue(sanitized);
    onKeystroke && onKeystroke();
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    if (formatted !== e.target.value) setValue(formatted);
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
      className={cn(
        'flex cursor-text flex-col gap-8 border border-black p-16 focus-within:border-white/50',
        className,
        isError && 'border-error/50 focus-within:border-error/50'
      )}
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
          onBlur={handleBlur}
          className={cn(
            'text-18 font-weight-500 grow text-ellipsis bg-transparent focus:outline-none',
            disabled && 'cursor-not-allowed text-white/40',
            isError && 'text-error'
          )}
          disabled={disabled}
          data-testid={testid}
          required={props.required}
        />
        <div className="bg-background-800 flex items-center gap-6 rounded-[20px] px-8 py-6">
          <LogoImager alt="Token" src={token.logoURI} className="size-20" />
          <span className="font-weight-500">{token.symbol}</span>
        </div>
      </div>
      <div className="text-12 font-weight-500 flex min-h-[16px] flex-wrap items-center justify-between gap-10 font-mono">
        <p className="flex items-center gap-5 break-all text-white/60">
          {!slippage?.isZero() && showFiatValue && getFiatAsString(value)}
          {slippage && value && <Slippage slippage={slippage} />}
        </p>
        {user && !withoutWallet && isBalanceLoading && (
          <button disabled type="button" data-testid="wallet-loading">
            Wallet: loading
          </button>
        )}
        {user && !withoutWallet && isBalanceLoading === false && (
          <button
            disabled={disabled}
            type="button"
            onClick={handleBalanceClick}
            className="group flex items-center"
          >
            <span className="text-white">
              Wallet: {prettifyNumber(balance || 0)}&nbsp;
            </span>
            <b
              className={
                disabled
                  ? 'text-primary/40'
                  : 'text-primary group-hover:text-white'
              }
            >
              MAX
            </b>
          </button>
        )}
      </div>
    </div>
  );
};
