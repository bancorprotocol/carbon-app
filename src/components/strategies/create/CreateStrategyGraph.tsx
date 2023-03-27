import { m } from 'libs/motion';
import { list } from './variants';
import { Button } from 'components/common/button';
import { TradingviewChart } from 'components/tradingviewChart';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { Token } from 'libs/tokens';
import { sendEvent } from 'services/googleTagManager';

type CreateStrategyGraphProps = {
  base: Token | undefined;
  quote: Token | undefined;
  setShowGraph: (value: boolean) => void;
};

export const CreateStrategyGraph = ({
  base,
  quote,
  setShowGraph,
}: CreateStrategyGraphProps) => {
  return (
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
          onClick={() => {
            sendEvent({
              event: 'strategy_chart_close',
            });
            setShowGraph(false);
          }}
        >
          <div className="flex items-center justify-center">
            <IconX className={'w-10 md:mr-12'} />
            <span className="hidden md:block">Close Chart</span>
          </div>
        </Button>
      </div>
      <TradingviewChart base={base} quote={quote} />
    </m.div>
  );
};
