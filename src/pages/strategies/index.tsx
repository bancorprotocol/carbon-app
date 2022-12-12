import { Button } from 'components/Button';
import { Page } from 'components/Page';
import { SearchInput } from 'components/SearchInput';
import { StrategyBlock } from 'components/StrategyBlock';
import { StrategyBlockCreate } from 'components/StrategyBlock/create';
import { m, mListVariant } from 'motion';
import { useGetUserStrategies } from 'queries';
import { FC, useMemo, useState } from 'react';
import { ReactComponent as IconArrowDown } from 'assets/icons/arrowDown.svg';
import { Link, PathNames } from 'routing';
import { useWeb3 } from 'web3';
import { WalletConnect } from 'components/WalletConnect';

export const StrategiesPage = () => {
  const strategies = useGetUserStrategies().data;
  const [search, setSearch] = useState('');
  const { user } = useWeb3();

  const filteredStrategies = useMemo(() => {
    return strategies?.filter(
      (strategy) =>
        strategy.tokens.source.symbol
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        strategy.tokens.target.symbol
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [search, strategies]);

  return user ? (
    filteredStrategies && strategies && strategies.length > 0 ? (
      <Page
        title={'Strategies'}
        widget={
          <StrategyPageTitleWidget search={search} setSearch={setSearch} />
        }
      >
        <m.div
          className={'grid grid-cols-1 gap-25 md:grid-cols-3'}
          variants={mListVariant}
          initial={'hidden'}
          animate={'visible'}
        >
          {filteredStrategies.map((s) => (
            <StrategyBlock key={s.id} strategy={s} />
          ))}

          <StrategyBlockCreate />
        </m.div>
      </Page>
    ) : (
      <CreateFirstStrategy />
    )
  ) : (
    <WalletConnect />
  );
};

const StrategyPageTitleWidget: FC<{
  search: string;
  setSearch: (value: string) => void;
}> = ({ search, setSearch }) => {
  return (
    <div className="flex items-center gap-20">
      <SearchInput
        value={search}
        setValue={setSearch}
        className="h-40 w-full"
      />
      <Button variant="tertiary" className="flex items-center gap-10">
        Filter & Sort <IconArrowDown className="w-14" />
      </Button>
      <Link to={PathNames.createStrategy}>
        <Button variant="secondary">Create Strategy</Button>
      </Link>
    </div>
  );
};

const CreateFirstStrategy = () => {
  return (
    <div className="h-screen p-20">
      <StrategyBlockCreate
        title="Create Your First Strategy"
        className="w-[270px] gap-[32px] text-center text-36"
      />
    </div>
  );
};
