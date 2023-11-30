import { FC } from 'react';
import { Token } from 'libs/tokens';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { TooltipTokenAmount } from '../edit/tooltip/TooltipTokenAmount';
import { OrderCreate } from '../create/useOrder';

interface DepositProps {
  currentBudget: string;
  token: Token;
  buy?: boolean;
}

export const DepositAllocatedBudget: FC<DepositProps> = (props) => {
  const { currentBudget, token, buy } = props;
  return (
    <div className="flex items-center justify-between gap-16 rounded-8 border border-emphasis py-8 px-16 font-mono text-12 font-weight-500">
      <p className="flex items-center gap-6">
        Allocated Budget
        <Tooltip
          sendEventOnMount={{ buy }}
          iconClassName="h-13 text-white/60"
          element={`This is the current available ${token.symbol} budget you can withdraw`}
        />
      </p>
      <TooltipTokenAmount amount={currentBudget} token={token} />
    </div>
  );
};

interface WithdrawProps {
  currentBudget: string;
  token: Token;
  order: OrderCreate;
  buy?: boolean;
}

export const WithdrawAllocatedBudget: FC<WithdrawProps> = (props) => {
  const { currentBudget, token, order, buy } = props;
  return (
    <div className="flex items-center justify-between gap-16 rounded-8 border border-emphasis py-8 px-16 font-mono text-12 font-weight-500">
      <p className="flex flex-1 items-center gap-6">
        Allocated Budget
        <Tooltip
          sendEventOnMount={{ buy }}
          iconClassName="h-13 text-white/60"
          element={`This is the current available ${token.symbol} budget you can withdraw`}
        />
      </p>
      <TooltipTokenAmount amount={currentBudget} token={token} />
      <button
        type="button"
        onClick={() => order.setBudget(currentBudget)}
        className="cursor-pointer font-weight-500 text-green"
      >
        MAX
      </button>
    </div>
  );
};
