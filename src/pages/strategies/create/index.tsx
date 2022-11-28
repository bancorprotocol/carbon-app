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
      value: 101,
    },
  ]);

  return (
    <Page title={'Create Strategy'}>
      <CandleStickChart
        data={data}
        boundaryLines={boundaries}
        setBoundaryLines={setBoundaries}
      />
      <pre>{JSON.stringify(boundaries, null, 2)}</pre>

      <CreateStrategy />
    </Page>
  );
};
