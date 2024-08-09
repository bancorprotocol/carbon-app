import { CreateStrategyOption } from 'components/strategies/create/CreateStrategyOption';
import { TradeChartSection } from 'components/trade/TradeChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';

export const TradeType = () => {
  const { base, quote } = useTradeCtx();
  return (
    <>
      <section
        aria-labelledby="trade-form-title"
        className="bg-background-800 flex flex-col gap-20 overflow-auto rounded p-20"
      >
        <h2 id="trade-form-title" className="text-18">
          Select Trade Strategy Type
        </h2>
        <CreateStrategyOption base={base} quote={quote} />
      </section>
      <TradeChartSection />
    </>
  );
};
