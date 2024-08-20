import { ReactComponent as WarningIcon } from 'assets/icons/warning.svg';

export const NoTrade = () => {
  return (
    <div className="bg-background-900 border-warning rounded-8 grid gap-8 border p-16">
      <header className="text-warning flex items-center gap-8">
        <WarningIcon className="size-16" />
        <h3 className="text-16">Notice</h3>
      </header>
      <p className="text-14 text-white/80">
        Congratulations, you're the first to trade this pair! Choose an
        alternative strategy and the built-in solver system will search
        liquidity chain-wide to fulfill your trades.
      </p>
    </div>
  );
};
