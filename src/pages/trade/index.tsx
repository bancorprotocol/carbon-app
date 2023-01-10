import { TradeWidget } from 'components/trade/widget/TradeWidget';
export const TradePage = () => {
  return (
    <div className="mx-auto mt-40 grid max-w-[1480px] grid-cols-12 gap-20">
      <div className={'col-span-4'}>
        <div className={'h-full rounded-10 bg-silver p-20'}>order book</div>
      </div>
      <div className={'col-span-8 space-y-20'}>
        <TradeWidget />
        <div className={'h-full rounded-10 bg-silver p-20'}>depth chart</div>
      </div>
    </div>
  );
};
