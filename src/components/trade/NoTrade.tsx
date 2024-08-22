import { ReactComponent as WarningIcon } from 'assets/icons/warning.svg';

export const NoTrade = () => {
  return (
    <div className="bg-background-900 border-warning rounded-8 grid gap-8 border p-16">
      <header className="text-warning flex items-center gap-8">
        <WarningIcon className="size-16" />
        <h3 className="text-16">Congratulations!</h3>
      </header>
      <p className="text-14 text-white/80">
        You're the first to trade this pair!
        <br />
        Create a trading strategy and the built-in solver system will search
        liquidity chain-wide to fulfill your trades.
      </p>
    </div>
  );
};
