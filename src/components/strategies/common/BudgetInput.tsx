import { ChangeEvent, FC, FocusEvent, useId, useRef } from 'react';
import { Token } from 'libs/tokens';
import { formatNumber, prettifyNumber, sanitizeNumber } from 'utils/helpers';
import { SafeDecimal } from 'libs/safedecimal';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';
import { TokenLogo } from 'components/common/imager/Imager';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { useWeb3 } from 'libs/web3';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import { Tooltip } from 'components/common/tooltip/Tooltip';

export type BudgetAction = 'withdraw' | 'deposit';

interface Props {
  action?: BudgetAction;
  token: Token;
  id?: string;
  className?: string;
  value?: string;
  max?: string;
  placeholder?: string;
  title?: string;
  titleTooltip?: string;
  disabled?: boolean;
  errors?: string[] | string;
  warnings?: string[];
  'data-testid'?: string;
  onChange: (value: string) => void;
}

export const BudgetInput: FC<Props> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const { user } = useWeb3();
  const {
    className,
    token,
    action = 'deposit',
    value = '',
    max = '',
    placeholder = 'Enter Amount',
    disabled,
    warnings = [],
    title,
    titleTooltip,
  } = props;
  const id = props.id ?? inputId;
  const { getFiatValue, selectedFiatCurrency: currentCurrency } =
    useFiatCurrency(token);
  const fiatValue = getFiatValue(value ?? '0', true);

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    if (formatted !== e.target.value) props.onChange(formatted);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNumber(e.target.value, token.decimals);
    props.onChange(sanitized);
  };

  const setMax = () => {
    if (max === value) return;
    if (max) {
      const balanceValue = new SafeDecimal(max).toFixed(token.decimals);
      props.onChange(balanceValue);
    }
  };

  const getErrors = () => {
    if (!props.errors) return [];
    if (Array.isArray(props.errors)) return props.errors;
    return [props.errors];
  };
  const hasErrors = getErrors().length > 0;

  return (
    <div className="flex flex-col gap-16">
      {title && (
        <label htmlFor={id} className="flex text-14 font-weight-500">
          <Tooltip element={titleTooltip}>
            <span className="text-white/80">{title}</span>
          </Tooltip>
        </label>
      )}
      <div
        className={`
          flex cursor-text flex-col gap-8 rounded border-2 border-black bg-black p-16
          focus-within:border-white/50
          ${hasErrors ? '!border-error/50' : ''}
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
            placeholder={placeholder}
            className={`
              grow text-ellipsis bg-transparent text-18 font-weight-500 focus:outline-none
              ${hasErrors ? 'text-error' : ''}
              ${disabled ? 'text-white/40' : ''}
              ${disabled ? 'cursor-not-allowed' : ''}
            `}
            onFocus={(e) => e.target.select()}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            data-testid={props['data-testid']}
          />
          <div className="flex items-center gap-6 rounded-[20px] bg-background-800 py-6 px-8">
            <TokenLogo token={token} size={20} />
            <span className="font-weight-500">{token.symbol}</span>
          </div>
        </div>
        <div className="flex min-h-[16px] flex-wrap items-center justify-between gap-10 font-mono text-12 font-weight-500">
          <p className="flex items-center gap-5 break-all text-white/60">
            {fiatValue.gt(0) && prettifyNumber(fiatValue, { currentCurrency })}
          </p>
          {user && max && (
            <button
              disabled={disabled}
              type="button"
              onClick={setMax}
              className="group flex items-center gap-4"
            >
              <span className="text-white/60">
                {action === 'deposit' ? 'Wallet:' : 'Allocated:'}
              </span>
              <span className="text-white">{prettifyNumber(max || '0')}</span>
              <span
                className={
                  disabled
                    ? 'text-primary/40'
                    : 'text-primary group-hover:text-white'
                }
              >
                MAX
              </span>
            </button>
          )}
        </div>
      </div>
      {getErrors().map((error, i) => (
        <WarningMessageWithIcon
          key={`error-${i}`}
          htmlFor={id}
          message={error}
          isError
        />
      ))}
      {warnings.map((warning, i) => (
        <WarningMessageWithIcon
          key={`warning-${i}`}
          htmlFor={id}
          message={warning}
        />
      ))}
    </div>
  );
};
