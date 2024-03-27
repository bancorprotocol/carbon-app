import { FC, ReactNode, useId } from 'react';
import { OrderCreate } from '../create/useOrder';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { Token } from 'libs/tokens';
import { UseQueryResult } from '@tanstack/react-query';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';

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
        <WarningMessageWithIcon htmlFor={inputId} isError>
          {order.budgetError}
        </WarningMessageWithIcon>
      )}
      {children}
    </div>
  );
};
