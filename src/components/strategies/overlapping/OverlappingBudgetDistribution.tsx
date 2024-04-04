import { Token } from 'libs/tokens';
import { FC, useId } from 'react';
import { cn, tokenAmount } from 'utils/helpers';
import { ReactComponent as IconDeposit } from 'assets/icons/deposit.svg';
import { ReactComponent as IconWithdraw } from 'assets/icons/withdraw.svg';
import { BudgetMode } from './OverlappingBudget';
import styles from './OverlappingBudgetDistribution.module.css';

interface Props {
  buy?: boolean;
  mode: BudgetMode;
  token: Token;
  initialBudget: string;
  deltaBudget: string;
  balance: string;
}

function getBudgetDistribution(
  initial: number,
  delta: number,
  balance: number,
  mode: BudgetMode
) {
  const newAllocation = mode === 'deposit' ? initial : initial - delta;
  const newBalance = mode === 'deposit' ? balance - delta : balance;
  const total = initial + balance;
  return {
    allocationPercent: Math.round((newAllocation / total) * 100),
    deltaPercent: Math.round((delta / total) * 100),
    balancePercent: Math.round((newBalance / total) * 100),
  };
}

function getGap(dist: ReturnType<typeof getBudgetDistribution>) {
  const { allocationPercent, deltaPercent, balancePercent } = dist;
  const list = [allocationPercent, deltaPercent, balancePercent];
  return (list.filter((v) => !!v).length - 1) * 4;
}

export const OverlappingBudgetDistribution: FC<Props> = (props) => {
  const allocatedId = useId();
  const walletId = useId();
  const { buy, token, initialBudget, deltaBudget, balance, mode } = props;
  const dist = getBudgetDistribution(
    Number(initialBudget),
    Number(deltaBudget),
    Number(balance),
    mode
  );
  console.log(dist);
  const color = buy ? 'bg-buy' : 'bg-sell';
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-14 font-weight-500">{buy ? 'Buy' : 'Sell'}</h4>
      <div className="flex justify-between text-12 text-white/60">
        <label htmlFor={allocatedId}>
          Allocated:&nbsp;
          <span className="text-white">
            {tokenAmount(initialBudget, token)}
          </span>
        </label>
        <label htmlFor={walletId}>
          Wallet:&nbsp;
          <span className="text-white">{tokenAmount(balance, token)}</span>
        </label>
      </div>
      <div
        className={styles.progress}
        style={{
          gap: getGap(dist),
        }}
      >
        <div
          className={cn(styles.allocation, color)}
          style={{ flexGrow: dist.allocationPercent }}
        ></div>
        <div
          aria-valuenow={dist.deltaPercent}
          className={cn(styles.delta, color)}
          style={{
            flexGrow: dist.deltaPercent,
            opacity: mode === 'deposit' ? 1 : 0.4,
          }}
        ></div>
        <div
          className={cn(styles.balance, color)}
          style={{ flexGrow: dist.balancePercent }}
        ></div>
      </div>
    </div>
  );
};

interface DescriptionProps {
  deltaBudget: string;
  mode: BudgetMode;
  token: Token;
}
export const OverlappingBudgetDescription: FC<DescriptionProps> = (props) => {
  const { deltaBudget, mode, token } = props;
  if (!Number(deltaBudget)) return null;
  if (mode === 'deposit') {
    return (
      <p className="flex items-start gap-8 text-14 text-white/60">
        <span className="rounded-full bg-buy/10 p-4 text-buy">
          <IconDeposit className="h-12 w-12" />
        </span>
        <span>
          You will <b>deposit {tokenAmount(deltaBudget, token)}</b> from your
          wallet to the strategy
        </span>
      </p>
    );
  } else {
    return (
      <p className="flex items-start gap-8 text-14 text-white/60">
        <span className="rounded-full bg-sell/10 p-4 text-sell">
          <IconWithdraw className="h-12 w-12" />
        </span>
        <span>
          You will <b>withdraw {tokenAmount(deltaBudget, token)}</b> from the
          strategy to your wallet.
        </span>
      </p>
    );
  }
};
