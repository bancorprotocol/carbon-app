import { useGetTokenBalance } from 'libs/queries';
import { Token } from 'libs/tokens';
import { FC, useId } from 'react';
import styles from './OverlappingBudgetDistribution.module.css';

interface Props {
  buy?: boolean;
  token: Token;
  initialBudget: string;
  updatedBudget: string;
}

function getBudgetDistribution(
  initial: string,
  updated: string,
  balance: string
) {
  const delta = Math.abs(Number(updated) - Number(initial));
  const total = Number(balance) + Number(updated);
  const initialPercent = Math.round((Number(initial) / total) * 100);
  const deltaPercent = Math.round((delta / total) * 100);
  const balancePercent = Math.round((Number(balance) / total) * 100);
  return { initialPercent, deltaPercent, balancePercent };
}

export const OverlappingBudgetDistribution: FC<Props> = (props) => {
  const allocatedId = useId();
  const walletId = useId();
  const { buy, token, initialBudget, updatedBudget } = props;
  const balance = useGetTokenBalance(token);
  const dist = getBudgetDistribution(
    initialBudget,
    updatedBudget,
    balance.data ?? '0'
  );
  return (
    <div className="flex flex-col gap-4">
      <h4>{buy ? 'Buy' : 'Sell'}</h4>
      <div className="flex justify-between text-12 text-white/60">
        <label htmlFor={allocatedId}>Allocated</label>
        <label htmlFor={walletId}>Wallet</label>
      </div>
      <div className={styles.progress}>
        <div
          className={styles.initial}
          style={{ flexGrow: dist.initialPercent }}
        ></div>
        <div
          aria-valuenow={dist.deltaPercent}
          className={styles.delta}
          style={{
            flexGrow: dist.deltaPercent,
            opacity: Number(updatedBudget) < Number(initialBudget) ? 0.1 : 1,
          }}
        ></div>
        <div
          className={styles.wallet}
          style={{ flexGrow: dist.balancePercent }}
        ></div>
      </div>
    </div>
  );
};
