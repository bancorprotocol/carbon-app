import { Page } from 'components/Page';
import { StrategyBlock } from 'components/StrategyBlock';
import { StrategyBlockCreate } from 'components/StrategyBlock/create';

export const StrategiesPage = () => (
  <Page title={'Strategies'}>
    <div
      className={
        'grid grid-cols-1 gap-30 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
      }
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <StrategyBlock key={i} />
      ))}

      <StrategyBlockCreate />
    </div>
  </Page>
);
