import { SearchInput } from 'components/common/searchInput';
import { useStrategyCtx } from 'hooks/useStrategies';
import { FC } from 'react';
import { cn } from 'utils/helpers';

interface Props {
  className?: string;
}
export const StrategySearch: FC<Props> = (props) => {
  const { search, setSearch } = useStrategyCtx();
  return (
    <SearchInput
      value={search}
      setValue={setSearch}
      className={cn('bg-background-900 rounded-full', props.className)}
    />
  );
};
