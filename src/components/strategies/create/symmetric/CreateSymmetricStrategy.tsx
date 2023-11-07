import { Link } from 'libs/routing';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { useCreateStrategy } from '../useCreateStrategy';
import { InputLimit } from '../BuySellBlock/InputLimit';
import { useMarketIndication } from 'components/strategies/marketPriceIndication';
import { SpreadInput } from './SpeadInput';

export const CreateSymmetricStrategy = () => {
  const { base, quote, order0, order1 } = useCreateStrategy();
  const { marketPricePercentage } = useMarketIndication({
    base,
    quote,
    order: order0,
    buy: false,
  });

  return (
    <>
      <article className="grid grid-flow-col grid-cols-[auto_auto] grid-rows-2 gap-8 rounded-10 bg-silver p-20">
        <h4 className="flex items-center gap-8 text-14 font-weight-500">
          Discover Symmetric Strategies
          <span className="rounded-8 bg-darkGreen px-8 py-4 text-10 text-green">
            NEW
          </span>
        </h4>
        <p className="text-12 text-white/60">
          Learn more about the new type of strategy creation.
        </p>
        <Link className="row-span-2 flex items-center gap-4 self-center justify-self-end text-12 font-weight-500 text-green">
          Learn More
          <IconLink className="h-12 w-12" />
        </Link>
      </article>
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <h3 className="text-18 font-weight-500">Price Range</h3>
        <svg></svg>
      </article>
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <h3 className="flex items-center gap-8 text-18 font-weight-500">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
            1
          </span>
          Set Price Range
        </h3>
        <div className="flex flex-col gap-10">
          <label htmlFor="min-buy-price">Min Buy Price</label>
          <InputLimit
            id="min-buy-price"
            token={base!}
            price={order0.min}
            setPrice={order0.setMin}
            error={order0.priceError}
            setPriceError={order0.setPriceError}
            marketPricePercentage={marketPricePercentage}
          />
        </div>
        <div className="flex flex-col gap-10">
          <label htmlFor="max-sell-price">Max Sell Price</label>
          <InputLimit
            id="max-sell-price"
            token={base!}
            price={order1.max}
            setPrice={order1.setMax}
            error={order1.priceError}
            setPriceError={order1.setPriceError}
            marketPricePercentage={marketPricePercentage}
          />
        </div>
      </article>
      <SpreadInput value={0.05} options={[0.01, 0.05, 0.1]} />
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <h3 className="text-18 font-weight-500">Set Budgets</h3>
        {/* <BudgetSection /> */}
      </article>
    </>
  );
};
