import { CreateStrategyCTA } from 'components/strategies/create/CreateStrategyCTA';
import { FC } from 'react';
import { SearchInput } from 'components/common/searchInput';
import { StrategyFilterSort } from 'components/strategies/overview/StrategyFilterSort';
import { cn } from 'utils/helpers';
import { useStrategyCtx } from 'hooks/useStrategies';

export const StrategyPageTitleWidget: FC<{
  showFilter: boolean;
}> = ({ showFilter }) => {
  const { search, setSearch } = useStrategyCtx();
  return (
    <div className="flex items-center gap-20">
      {showFilter && (
        <>
          <div className="order-last col-span-2 md:order-first">
            <SearchInput
              value={search}
              setValue={setSearch}
              className="rounded-full bg-charcoal"
            />
          </div>
          <StrategyFilterSort />
        </>
      )}

      <div className={cn('hidden', 'md:block')}>
        <CreateStrategyCTA />
      </div>
    </div>
  );
};
