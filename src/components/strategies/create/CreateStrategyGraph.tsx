import { m } from 'libs/motion';
import { list } from './variants';
import { Button } from 'components/common/button';
import { TradingviewChart } from 'components/tradingviewChart';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { UseStrategyCreateReturn } from 'components/strategies/create/useCreateStrategy';
import { FC } from 'react';

type Props = Pick<UseStrategyCreateReturn, 'base' | 'quote' | 'setShowGraph'>;
export const CreateStrategyGraph: FC<Props> = ({
  base,
  quote,
  setShowGraph,
}) => {
  return (
    <div className={`absolute right-20`}>
      <m.div
        variants={list}
        className="flex h-[550px] flex-col rounded-10 bg-silver p-20 pb-40"
      >
        <div className="flex items-center justify-between">
          <h2 className="mb-20 font-weight-500">Price Chart</h2>
          <Button
            className={`mb-20 self-end bg-emphasis`}
            variant="secondary"
            size={'md'}
            onClick={() => setShowGraph(false)}
          >
            <div className="flex items-center justify-center">
              <IconX className={'w-10 md:mr-12'} />
              <span className="hidden md:block">Close Chart</span>
            </div>
          </Button>
        </div>
        <TradingviewChart base={base} quote={quote} />
      </m.div>
    </div>
  );
};
