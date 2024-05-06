import { Token } from 'libs/tokens';
import { FC, useState } from 'react';
import { BudgetInput } from '../common/BudgetInput';
import { cn, prettifyNumber, tokenAmount } from 'utils/helpers';
import { ReactComponent as IconEdit } from 'assets/icons/edit.svg';
import { ReactComponent as IconCoinGecko } from 'assets/icons/coin-gecko.svg';
import { LogoImager } from 'components/common/imager/Imager';
import { m } from 'libs/motion';
import { items } from '../create/variants';
import { Button } from 'components/common/button';
import { NewTabLink } from 'libs/routing';
import { DropdownMenu, MenuButtonProps } from 'components/common/dropdownMenu';

interface Props {
  base: Token;
  quote: Token;
  externalPrice: number;
  marketPrice: string;
  setMarketPrice: (price: string) => void;
}
export const OverlappingMarketPrice: FC<Props> = (props) => {
  const { externalPrice, marketPrice, quote } = props;
  const [open, setOpen] = useState(false);

  if (!Number(props.marketPrice)) {
    return (
      <m.article
        variants={items}
        key="marketPrice"
        className="rounded-10 bg-background-900 flex flex-col"
      >
        <MarketPriceField {...props} />
      </m.article>
    );
  }

  const Trigger = (attr: MenuButtonProps) => (
    <button
      {...attr}
      className="flex items-center justify-between p-16"
      type="button"
    >
      {externalPrice === Number(marketPrice) && (
        <h3 className="text-14 font-weight-500 flex items-center gap-8">
          <span>Set Market Price</span>
          <span className="text-12 text-white/60">(Optional)</span>
        </h3>
      )}
      {externalPrice !== Number(marketPrice) && (
        <h3 className="text-14 font-weight-500 flex items-center gap-8">
          Market Price:
          <span className="text-12 text-white/60">
            {tokenAmount(marketPrice, quote)}
          </span>
        </h3>
      )}
      <IconEdit className="size-16 text-white/60" />
    </button>
  );

  return (
    <m.article
      variants={items}
      key="marketPrice"
      className="rounded-10 bg-background-900 flex flex-col"
    >
      <DropdownMenu
        isOpen={open}
        setIsOpen={setOpen}
        placement="top"
        button={Trigger}
      >
        <MarketPriceField
          {...props}
          className="w-[400px]"
          close={() => setOpen(false)}
        />
      </DropdownMenu>
    </m.article>
  );
};

interface FieldProps extends Props {
  className?: string;
  close?: () => void;
}

const MarketPriceField = (props: FieldProps) => {
  const { base, quote, externalPrice, marketPrice } = props;
  const [localPrice, setLocalPrice] = useState(marketPrice);

  const setPrice = () => {
    if (!Number(localPrice)) return;
    props.setMarketPrice(localPrice);
    if (props.close) props.close();
  };

  return (
    <div className={cn(props.className, 'flex flex-col gap-20 p-16')}>
      <BudgetInput
        title={`Enter Market Price (${quote.symbol} per 1${base.symbol})`}
        titleTooltip="Price used to calculate overlapping strategy params"
        value={localPrice}
        onChange={setLocalPrice}
        token={quote}
        error={!!Number(localPrice) ? '' : 'Price must be greater than 0'}
        withoutWallet
      />
      {!!externalPrice && (
        <div className="text-12 flex items-center justify-between rounded border border-white/10 p-16">
          <p className="text-white/80">CoinGecko Market Price</p>
          <button
            className="flex items-center gap-8"
            onClick={() => setLocalPrice(externalPrice.toString())}
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
        By changing the market price, you change the price area in which your
        overlapping strategy will begin to work.
        {!!externalPrice && (
          <span>
            You can always return to the current market price. Market price
            provided by&nbsp;
            <NewTabLink
              className="text-primary inline-flex items-center gap-8"
              to="https://www.coingecko.com/"
            >
              <b>CoinGecko</b>
              <IconCoinGecko className="size-10" />
            </NewTabLink>
          </span>
        )}
      </p>
      <Button type="button" disabled={!Number(localPrice)} onClick={setPrice}>
        Confirm
      </Button>
    </div>
  );
};
