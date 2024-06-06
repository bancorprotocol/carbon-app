// import { FC, useState } from 'react';
// import { m } from 'libs/motion';
// import { EditStrategyHeader } from './EditStrategyHeader';
// import { EditStrategyLayout } from './EditStrategyLayout';
// import { list } from 'components/strategies/common/variants';
// import { Strategy } from 'libs/queries';
// import { useSearch } from 'libs/routing';
// import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';

// interface Props {
//   strategy?: Strategy;
//   isLoading: boolean;
// }

// export const EditStrategyMain: FC<Props> = ({ strategy, isLoading }) => {
//   const [showGraph, setShowGraph] = useState(true);
//   const { type } = useSearch({ from: '/strategies/edit/$strategyId' });

//   return (
//     <m.div
//       className={`flex flex-col items-center gap-20 p-20 ${
//         showGraph ? 'justify-between' : 'justify-center'
//       }`}
//       variants={list}
//       initial="hidden"
//       animate="visible"
//     >
//       <EditStrategyHeader {...{ showGraph, setShowGraph, type }} />
//       {isLoading && <CarbonLogoLoading className="my-40 w-60" />}
//       {!isLoading && type && strategy && (
//         <EditStrategyLayout
//           {...{
//             strategy,
//             type,
//             showGraph,
//             setShowGraph,
//           }}
//         />
//       )}
//     </m.div>
//   );
// };
