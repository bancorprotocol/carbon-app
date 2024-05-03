import { Token } from 'libs/tokens';
import { FC, useState } from 'react';
import { BudgetInput } from '../common/BudgetInput';
import { prettifyNumber, tokenAmount } from 'utils/helpers';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { LogoImager } from 'components/common/imager/Imager';
import { m } from 'libs/motion';
import { items } from '../create/variants';

interface Props {
  base: Token;
  quote: Token;
  externalPrice: number;
  marketPrice: string;
  setMarketPrice: (price: string) => void;
}
export const OverlappingMarketPrice: FC<Props> = (props) => {
  const { base, quote, externalPrice, marketPrice } = props;
  const [error, setError] = useState('');

  const setMarketPrice = (value: string) => {
    if (!Number(value)) setError('Price must be greater than 0');
    else setError('');
    props.setMarketPrice(value);
  };

  return (
    <m.article
      variants={items}
      key="marketPrice"
      className="rounded-10 bg-background-900 p-16"
    >
      <details open={!externalPrice} className="group">
        <summary className="flex cursor-pointer items-center justify-between">
          <h3 className="text-18 font-weight-500 flex items-center gap-8">
            {!Number(marketPrice) && 'Set Market Price'}
            {!!Number(marketPrice) && (
              <>
                <span>Market Price:</span>
                <span className="text-16 text-white/60">
                  {tokenAmount(marketPrice, quote)}
                </span>
              </>
            )}
          </h3>
          <IconChevron className="size-14 group-open:rotate-180" />
        </summary>
        <div className="mt-16 flex flex-col gap-20">
          <BudgetInput
            title={`Enter Market Price (${quote.symbol} per 1${base.symbol})`}
            titleTooltip="Price used to calculate overlapping strategy params"
            value={marketPrice}
            onChange={setMarketPrice}
            token={quote}
            error={error}
            withoutWallet
          />
          {!!externalPrice && (
            <div className="text-12 flex items-center justify-between rounded border border-white/10 p-16">
              <p className="text-white/80">CoinGecko Market Price</p>
              <button
                className="flex gap-8"
                onClick={() => setMarketPrice(externalPrice.toString())}
                type="button"
              >
                {prettifyNumber(externalPrice)}
                <LogoImager
                  className="size-12"
                  src={quote.logoURI}
                  alt={quote.name ?? ''}
                />
                <span className="text-primary">RESET</span>
              </button>
            </div>
          )}
          <p className="text-12 text-white/60">
            By changing the market price, you change the price area in which
            your overlapping strategy will begin to work.
          </p>
        </div>
      </details>
    </m.article>
  );
};
