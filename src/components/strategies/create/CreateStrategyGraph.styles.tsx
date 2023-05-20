import tw from 'tailwind-styled-components';
import { m } from 'libs/motion';

export const CreateStrategyGraphContainer = tw.div<{ showGraph: boolean }>`
flex
flex-col
${(showGraph) => (showGraph ? 'flex-1' : 'absolute right-20')}
`;

export const GraphTitle = tw.h2`
  mb-20
  font-weight-500
`;

export const CloseChartButton = tw.div`
  flex
  items-center
  justify-center
`;

export const AnimatedGraphContainer = tw(m.div)`
  flex
  h-[550px]
  flex-col 
  rounded-10
  bg-silver
  p-20
  pb-40
`;
