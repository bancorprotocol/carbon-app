import { StrategyBlockCreate } from 'elements/strategies/overview/strategyBlock/StrategyBlockCreate';

export const StrategyCreateFirst = () => {
  return (
    <div className="h-full p-20">
      <StrategyBlockCreate
        title="Create Your First Strategy"
        className="w-[270px] gap-[32px] text-center text-36"
      />
    </div>
  );
};
