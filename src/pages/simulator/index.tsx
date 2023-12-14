import { Page } from 'components/common/page';
import { SimulatorWrapper } from 'libs/d3/sim/SimulatorWrapper';

export const SimulatorPage = () => {
  return (
    <Page title={'Simulator'}>
      <div className={'grid grid-cols-1 gap-20'}>
        <SimulatorWrapper />
      </div>
    </Page>
  );
};
