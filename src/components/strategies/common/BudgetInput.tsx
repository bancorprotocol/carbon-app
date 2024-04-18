import { Tooltip } from 'components/common/tooltip/Tooltip';
import { FC, ReactNode, useId } from 'react';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { Token } from 'libs/tokens';
import { UseQueryResult } from '@tanstack/react-query';

interface Props {
  id?: string;
  children?: ReactNode;
  value: string;
  error?: string;
  token: Token;
  query?: UseQueryResult<string>;
  onChange: (value: string) => void;
  disabled?: boolean;
  withoutWallet?: boolean;
  'data-testid'?: string;
  title: string;
  titleTooltip: string;
}

export const BudgetInput: FC<Props> = (props) => {
  const {
    id,
    value,
    error,
    token,
    query,
    children,
    onChange,
    title,
    titleTooltip,
  } = props;
  const inputId = useId();
  const balance = query?.data ?? '0';

  return (
    <div className="flex flex-col gap-16">
      <label className="text-14 font-weight-500 flex">
        <Tooltip element={titleTooltip}>
          <span className="text-white/80">{title}</span>
        </Tooltip>
      </label>
      <TokenInputField
        id={id ?? inputId}
        className="rounded-16 bg-black p-16"
        value={value}
        setValue={onChange}
        token={token}
        isBalanceLoading={query?.isLoading}
        balance={balance}
        isError={!!error}
        withoutWallet={!!props.withoutWallet}
        disabled={!!props.disabled}
        data-testid={props['data-testid']}
      />
      {!!error && (
        <output
          htmlFor={inputId}
          role="alert"
          aria-live="polite"
          className="text-12 text-error flex items-center gap-10 font-mono"
        >
          <IconWarning className="size-12" />
          <span className="flex-1">{error}</span>
        </output>
      )}
      {children}
    </div>
  );
};
