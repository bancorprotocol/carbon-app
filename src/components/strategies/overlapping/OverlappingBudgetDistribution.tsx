import { Token } from 'libs/tokens';
import { FC, useId } from 'react';
import { cn, tokenAmount } from 'utils/helpers';
import { ReactComponent as IconDeposit } from 'assets/icons/deposit.svg';
import { ReactComponent as IconWithdraw } from 'assets/icons/withdraw.svg';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import styles from './OverlappingBudgetDistribution.module.css';

interface Props {
  buy?: boolean;
  token: Token;
  initialBudget: string;
  withdraw: string;
  deposit: string;
  balance: string;
}

function getBudgetDistribution(
  initial: number,
  withdraw: number,
  deposit: number,
  balance: number
) {
  const total = initial + balance;
  const delta = ((deposit || withdraw) / total) * 100;
  const newAllocation = (Math.max(initial - withdraw, 0) / total) * 100;
  const newBalance = (Math.max(balance - deposit, 0) / total) * 100;
  return {
    mode: deposit ? 'deposit' : 'withdraw',
    allocationPercent: Math.round(newAllocation),
    deltaPercent: Math.round(delta),
    balancePercent: Math.round(newBalance),
  };
}

export const OverlappingBudgetDistribution: FC<Props> = (props) => {
  const allocatedId = useId();
  const walletId = useId();
  const { buy, token, initialBudget, withdraw, deposit, balance } = props;
  const dist = getBudgetDistribution(
    Number(initialBudget),
    Number(withdraw),
    Number(deposit),
    Number(balance)
  );
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
      <div className={styles.progress}>
        <div
          aria-valuenow={dist.allocationPercent}
          className={cn(styles.allocation, color)}
          style={{ flexGrow: dist.allocationPercent }}
        ></div>
        <div
          aria-valuenow={dist.deltaPercent}
          className={cn(styles.delta, color)}
          style={{
            flexGrow: dist.deltaPercent,
            opacity: !dist.deltaPercent ? 0 : dist.mode === 'deposit' ? 1 : 0.4,
          }}
        ></div>
        <div
          aria-valuenow={dist.balancePercent}
          className={cn(styles.balance, color)}
          style={{ flexGrow: dist.balancePercent }}
        ></div>
      </div>
    </div>
  );
};

interface DescriptionProps {
  withdraw: string;
  deposit: string;
  token: Token;
  initialBudget: string;
  balance: string;
}
export const OverlappingBudgetDescription: FC<DescriptionProps> = (props) => {
  const token = props.token;
  const withdraw = Number(props.withdraw);
  const deposit = Number(props.deposit);
  if (deposit) {
    const balance = Number(props.balance);
    if (deposit > balance) {
      return (
        <WarningMessageWithIcon isError>
          You should <b>deposit {tokenAmount(deposit, token)}</b> from your
          wallet. But your wallet has insufficient balance.
        </WarningMessageWithIcon>
      );
    }
    return (
      <p className="flex items-start gap-8 text-14 text-white/60">
        <span className="rounded-full bg-buy/10 p-4 text-buy">
          <IconDeposit className="h-12 w-12" />
        </span>
        <span>
          You will <b>deposit {tokenAmount(deposit, token)}</b> from your wallet
          to the strategy
        </span>
      </p>
    );
  }
  if (withdraw) {
    const initialBudget = Number(props.initialBudget);
    console.log({ withdraw, initialBudget });
    if (withdraw > initialBudget) {
      return (
        <WarningMessageWithIcon isError>
          You should <b>withdraw {tokenAmount(withdraw, token)}</b> from the
          strategy. But the allocated budget is insufficient.
        </WarningMessageWithIcon>
      );
    }
    return (
      <p className="flex items-start gap-8 text-14 text-white/60">
        <span className="rounded-full bg-sell/10 p-4 text-sell">
          <IconWithdraw className="h-12 w-12" />
        </span>
        <span>
          You will <b>withdraw {tokenAmount(withdraw, token)}</b> from the
          strategy to your wallet.
        </span>
      </p>
    );
  }
  return null;
};
