import { ChangeEvent, FC, FocusEvent, ReactNode, useRef } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { useWagmi } from 'libs/wagmi';
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
import { isZero } from 'components/strategies/common/utils';

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
  children?: ReactNode;
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
    children,
  } = props;
  const { user } = useWagmi();
  const inputRef = useRef<HTMLInputElement>(null);
  const { getFiatValue, getFiatAsString, hasFiatValue } =
    useFiatCurrency(token);
  const fiatValueUsd = getFiatValue(value);

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNumber(value, token.decimals);
    setValue(sanitized);
    if (onKeystroke) onKeystroke();
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
    if (onKeystroke) onKeystroke();
  };

  const priceText = () => {
    if (slippage?.isZero()) return;
    if (!hasFiatValue()) return 'USD value unavailable';
    if (fiatValueUsd.gt(0)) return getFiatAsString(value);
  };

  const TokenWidget = children ?? (
    <div className="bg-main-600 flex items-center gap-6 rounded-[20px] px-8 py-6">
      <LogoImager alt="Token" src={token.logoURI} className="size-20" />
      <span className="font-medium">{token.symbol}</span>
    </div>
  );

  return (
    <div
      className={cn(
        'flex cursor-text flex-col gap-8 border border-transparent',
        className,
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
            'text-24 font-medium grow text-ellipsis bg-transparent focus:outline-hidden',
            disabled && 'cursor-not-allowed text-main-0/40',
            isError && 'text-error',
          )}
          disabled={disabled}
          data-testid={testid}
          required={props.required}
        />
        {TokenWidget}
      </div>
      <div className="text-12 font-medium flex min-h-[16px] flex-wrap items-center justify-between gap-10">
        <p className="flex items-center gap-5 text-main-0/60">
          {priceText()}
          {slippage && !isZero(value) && <Slippage slippage={slippage} />}
        </p>
        {user && !withoutWallet && isBalanceLoading && (
          <button
            disabled
            type="button"
            className="loading-message"
            data-testid="wallet-loading"
          >
            Wallet: loading
          </button>
        )}
        {user && !withoutWallet && isBalanceLoading === false && (
          <button
            disabled={disabled}
            type="button"
            onClick={handleBalanceClick}
            className="group/token-input flex items-center"
          >
            <span className="text-main-0">
              Wallet: {prettifyNumber(balance || 0)}&nbsp;
            </span>
            <b className="text-gradient hover:text-secondary focus:text-secondary active:text-secondary group-disabled/token-input:text-primary/40">
              MAX
            </b>
          </button>
        )}
      </div>
    </div>
  );
};
