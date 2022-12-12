import { Button } from 'components/Button';
import { Page } from 'components/Page';
import { SearchInput } from 'components/SearchInput';
import { StrategyBlock } from 'components/StrategyBlock';
import { StrategyBlockCreate } from 'components/StrategyBlock/create';
import { m, mListVariant } from 'motion';
import { useGetUserStrategies } from 'queries';
import { FC, useState } from 'react';
import { ReactComponent as IconArrowDown } from 'assets/icons/arrowDown.svg';
import { Link, PathNames } from 'routing';

export const StrategiesPage = () => {
  const { data } = useGetUserStrategies();
  const [search, setSearch] = useState('');

  return (
    <Page
      title={'Strategies'}
      widget={<StrategyPageTitleWidget search={search} setSearch={setSearch} />}
    >
      <m.div
        className={'grid grid-cols-1 gap-25 md:grid-cols-3'}
        variants={mListVariant}
        initial={'hidden'}
        animate={'visible'}
      >
        {data?.map((s) => (
          <StrategyBlock key={s.id} strategy={s} />
        ))}

        <StrategyBlockCreate />
      </m.div>
    </Page>
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
