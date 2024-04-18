import { StrategyBlockCreate } from 'components/strategies/overview/strategyBlock/StrategyBlockCreate';

export const StrategyCreateFirst = () => {
  return (
    <div className="h-full p-20" data-testid="first-strategy">
      <StrategyBlockCreate
        title="Create Your First Strategy"
        className="text-36 h-[600px] text-center"
      />
    </div>
  );
};
