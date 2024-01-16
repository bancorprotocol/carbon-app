import { FC, ReactNode, useId } from 'react';
import { OrderCreate } from '../create/useOrder';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { Token } from 'libs/tokens';
import { UseQueryResult } from '@tanstack/react-query';

interface Props {
  id?: string;
  children?: ReactNode;
  order: OrderCreate;
  token: Token;
  query: UseQueryResult<string>;
  onChange: (value: string) => void;
  disabled?: boolean;
  withoutWallet?: boolean;
  'data-testid'?: string;
}

export const BudgetInput: FC<Props> = (props) => {
  const { id, order, token, query, children, onChange } = props;
  const inputId = useId();
  const balance = query.data ?? '0';

  return (
    <div className="flex flex-col gap-16">
      <TokenInputField
        id={id ?? inputId}
        className="rounded-16 bg-black p-16"
        value={order.budget}
        setValue={onChange}
        token={token}
        isBalanceLoading={query.isLoading}
        balance={balance}
        isError={!!order.budgetError}
        withoutWallet={!!props.withoutWallet}
        disabled={!!props.disabled}
        data-testid={props['data-testid']}
      />
      {!!order.budgetError && (
        <output
          htmlFor={inputId}
          role="alert"
          aria-live="polite"
          className="flex items-center gap-10 font-mono text-12 text-red"
        >
          <IconWarning className="h-12 w-12" />
          <span className="flex-1">{order.budgetError}</span>
        </output>
      )}
      {children}
    </div>
  );
};
