import tw from 'tailwind-styled-components';
import { m } from 'libs/motion';
import { ReactComponent as IconX } from 'assets/icons/X.svg';

export const CreateStrategyGraphContainer = tw.div<{ showGraph: boolean }>`
flex
flex-col
${(showGraph) => (showGraph ? 'flex-1' : 'absolute right-20')}
`;

export const GraphTitle = tw.h2`
  mb-20
  font-weight-500
`;

export const CloseChartLabelContainer = tw.div`
  flex
  items-center
  justify-center
`;

export const AnimatedGraph = tw(m.div)`
  flex
  h-[550px]
  flex-col 
  rounded-10
  bg-silver
  p-20
  pb-40
`;

export const CloseIcon = tw(IconX)`
  w-10 
  md:mr-12`;

export const CloseChart = tw.span`
  hidden 
  md:block`;
