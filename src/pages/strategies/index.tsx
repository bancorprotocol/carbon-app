import { Page } from 'components/Page';
import { StrategyBlock } from 'components/StrategyBlock';
import { StrategyBlockCreate } from 'components/StrategyBlock/create';

export const StrategiesPage = () => (
  <Page title={'Strategies'}>
    <div className={'grid grid-cols-4 gap-30'}>
      <StrategyBlock />
      <StrategyBlock />
      <StrategyBlock />
      <StrategyBlock />
      <StrategyBlock />
      <StrategyBlock />

      <StrategyBlockCreate />
    </div>
  </Page>
);
