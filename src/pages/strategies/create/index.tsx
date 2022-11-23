import { Page } from 'components/Page';
import { CreateStrategy } from 'elements/strategies/create';
import { CandleStickChart } from 'components/Chart/CandleStickChart';
import * as fc from 'd3fc';
import { useState } from 'react';

const data = fc.randomFinancial()(50);

export const CreateStrategyPage = () => {
  const [boundaries, setBoundaries] = useState([
    {
      name: 'low',
      value: 100,
    },
    {
      name: 'high',
      value: 90,
    },
  ]);

  return (
    <Page title={'Create Strategy'}>
      <CandleStickChart data={data} boundaryLines={boundaries} />
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <CreateStrategy />
    </Page>
  );
};
