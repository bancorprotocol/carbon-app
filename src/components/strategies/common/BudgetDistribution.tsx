import { Token } from 'libs/tokens';
import { FC, useId } from 'react';
import { cn, tokenAmount } from 'utils/helpers';
import IconDeposit from 'assets/icons/deposit.svg?react';
import IconWithdraw from 'assets/icons/withdraw.svg?react';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { useFiatValue } from 'hooks/useFiatValue';

interface Props {
  title?: string;
  isBuy?: boolean;
  token: Token;
  initialBudget: string;
  withdraw: string;
  deposit: string;
  balance?: string;
  isSimulator?: boolean;
}

function getBudgetDistribution(
  initial: number,
  withdraw: number,
  deposit: number,
  balance: number,
  isSimulator: boolean,
) {
  const total = initial + balance;
  const delta = deposit || withdraw;
  if (isSimulator) {
    return {
      mode: 'deposit',
      allocationPercent: deposit ? 0.5 : 0,
      deltaPercent: 0,
      balancePercent: deposit ? 0.5 : 1,
    };
  } else if (!total) {
    return {
      mode: deposit ? 'deposit' : 'withdraw',
      allocationPercent: 0,
      deltaPercent: 0,
      balancePercent: 1,
    };
  } else if (delta > total) {
    return {
      mode: deposit ? 'deposit' : 'withdraw',
      allocationPercent: 0,
      deltaPercent: 1,
      balancePercent: 0,
    };
  } else {
    const deltaPercent = (delta / total) * 100;
    const newAllocation = (Math.max(initial - withdraw, 0) / total) * 100;
    const newBalance = (Math.max(balance - deposit, 0) / total) * 100;
    return {
      mode: deposit ? 'deposit' : 'withdraw',
      allocationPercent: Math.round(newAllocation),
      deltaPercent: Math.round(deltaPercent),
      balancePercent: Math.round(newBalance),
    };
  }
}

export const BudgetDistribution: FC<Props> = (props) => {
  const allocatedId = useId();
  const walletId = useId();
  const { title, isBuy, token, initialBudget, withdraw, deposit, balance } =
    props;
  const isSimulator = !!props.isSimulator;
  const dist = getBudgetDistribution(
    Number(initialBudget),
    Number(withdraw),
    Number(deposit),
    Number(balance ?? '0'),
    isSimulator,
  );
  const color = isBuy ? 'bg-buy-gradient' : 'bg-sell-gradient';
  return (
    <div className="flex flex-col gap-4">
      {title && (
        <h4 className="flex gap-16 text-14 items-center">
          <span className="font-medium">{title}</span>
          {isSimulator && !!Number(deposit) && (
            <span>{tokenAmount(deposit, token)}</span>
          )}
        </h4>
      )}
      {!isSimulator && (
        <div className="text-12 grid grid-flow-col text-main-0/60">
          {!!Number(initialBudget) && (
            <label htmlFor={allocatedId}>
              Allocated:&nbsp;
              {initialBudget ? (
                <span className="text-main-0">
                  {tokenAmount(initialBudget, token)}
                </span>
              ) : (
                <span className="loading-message text-main-0">Loading</span>
              )}
            </label>
          )}
          <label htmlFor={walletId} className="self-end text-end">
            Wallet:&nbsp;
            {balance ? (
              <span className="text-main-0">{tokenAmount(balance, token)}</span>
            ) : (
              <span className="loading-message text-main-0">Loading</span>
            )}
          </label>
        </div>
      )}
      <div className="rounded-md flex h-[24px] gap-4 overflow-hidden transition-[gap] duration-200">
        <div
          aria-valuenow={dist.allocationPercent}
          className={cn(
            color,
            'transition-[flex-grow] duration-200 aria-[valuenow="0"]:-ml-4',
          )}
          style={{ flexGrow: dist.allocationPercent }}
        ></div>
        <div
          aria-valuenow={dist.deltaPercent}
          className={cn(
            color,
            'transition-[flex-grow] duration-200 aria-[valuenow="0"]:-mx-2',
          )}
          style={{
            flexGrow: dist.deltaPercent,
            opacity: !dist.deltaPercent ? 0 : dist.mode === 'deposit' ? 1 : 0.4,
          }}
        ></div>
        <div
          aria-valuenow={dist.balancePercent}
          className={cn(
            color,
            'opacity-40 transition-[flex-grow] duration-200 aria-[valuenow="0"]:-mr-4',
          )}
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
export const BudgetDescription: FC<DescriptionProps> = (props) => {
  const token = props.token;
  const withdraw = Number(props.withdraw);
  const deposit = Number(props.deposit);
  const withdrawFiat = useFiatValue({ price: props.withdraw, token });
  const depositFiat = useFiatValue({ price: props.deposit, token });
  if (deposit) {
    const balance = Number(props.balance);
    if (deposit > balance) {
      return (
        <Warning className="text-12" isError data-testid="insufficient-balance">
          You should&nbsp;
          <b className="font-medium">deposit {tokenAmount(deposit, token)}</b>
          {depositFiat && <b>&nbsp;({depositFiat})</b>}
          &nbsp;from your wallet, but your wallet has insufficient balance.
          Consider changing token deposit amount or prices.
        </Warning>
      );
    }
    return (
      <p className="warning-message animate-scale-up text-12 flex items-start gap-8 text-main-0/60">
        <span className="bg-buy/10 text-buy rounded-full p-4">
          <IconDeposit className="h-12 w-12" />
        </span>
        <span>
          You will&nbsp;
          <b className="font-medium" data-testid={`deposit-${token.symbol}`}>
            deposit {tokenAmount(deposit, token)}
          </b>
          {depositFiat && <b>&nbsp;({depositFiat})</b>}
          &nbsp;from your wallet to the strategy.
        </span>
      </p>
    );
  }
  if (withdraw) {
    const initialBudget = Number(props.initialBudget);
    if (withdraw > initialBudget) {
      return (
        <Warning className="text-12" isError data-testid="insufficient-funds">
          You should&nbsp;
          <b className="font-medium">withdraw {tokenAmount(withdraw, token)}</b>
          {withdrawFiat && <b>&nbsp;({withdrawFiat})</b>}
          &nbsp;from the strategy, but the strategy has insufficient funds.
          Consider changing token deposit amount or prices.
        </Warning>
      );
    }
    return (
      <p className="warning-message animate-scale-up text-12 flex items-start gap-8 text-main-0/60">
        <span className="bg-sell/10 text-sell rounded-full p-4">
          <IconWithdraw className="h-12 w-12" />
        </span>
        <span>
          You will&nbsp;
          <b className="font-medium" data-testid={`withdraw-${token.symbol}`}>
            withdraw {tokenAmount(withdraw, token)}
          </b>
          {withdrawFiat && <b>&nbsp;({withdrawFiat})</b>}
          &nbsp;from the strategy to your wallet.
        </span>
      </p>
    );
  }
  return null;
};
