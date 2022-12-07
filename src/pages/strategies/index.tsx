import { Page } from 'components/Page';
import { StrategyBlock } from 'components/StrategyBlock';
import { StrategyBlockCreate } from 'components/StrategyBlock/create';
import { m, mListVariant } from 'motion';
import { useGetUserStrategies } from 'queries';

export const StrategiesPage = () => {
  const { data } = useGetUserStrategies();

  return (
    <Page title={'Strategies'}>
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
