import { useSimulator } from 'libs/d3/sim/SimulatorProvider';
import { D3ChartSettingsProps } from 'libs/d3/types';
import { ReactNode } from 'react';

type Props = {
  settings: D3ChartSettingsProps;
  children: ReactNode;
};

export const SimulatorChartWrapper = (props: Props) => {
  const { data } = useSimulator();

  // return <D3ChartProvider {...props} data={data} />;
};
