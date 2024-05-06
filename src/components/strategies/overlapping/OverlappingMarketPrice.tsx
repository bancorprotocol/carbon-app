import { Token } from 'libs/tokens';
import { FC, useState } from 'react';
import { BudgetInput } from '../common/BudgetInput';
import { cn, prettifyNumber } from 'utils/helpers';
import { ReactComponent as IconCoinGecko } from 'assets/icons/coin-gecko.svg';
import { ReactComponent as IconEdit } from 'assets/icons/edit.svg';
import { LogoImager } from 'components/common/imager/Imager';
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
  const [open, setOpen] = useState(false);
  const Trigger = (attr: MenuButtonProps) => (
    <button
      {...attr}
      className="text-12 font-weight-500 bg-background-800 hover:bg-background-700 flex items-center justify-between gap-8 rounded-full px-16 py-8"
      type="button"
    >
      <IconEdit className="size-16" />
      <span>Edit Market Price</span>
    </button>
  );

  return (
    <DropdownMenu
      isOpen={open}
      setIsOpen={setOpen}
      placement="bottom-end"
      button={Trigger}
    >
      <OverlappingInitMarketPriceField
        {...props}
        className="w-[400px] max-w-[80vw]"
        close={() => setOpen(false)}
      />
    </DropdownMenu>
  );
};

interface FieldProps extends Props {
  className?: string;
  close?: () => void;
}

export const OverlappingInitMarketPriceField = (props: FieldProps) => {
  const { base, quote, externalPrice, marketPrice } = props;
  const [localPrice, setLocalPrice] = useState(marketPrice);
  const [error, setError] = useState('');

  const changePrice = (value: string) => {
    if (!Number(value)) setError('Price must be greater than 0');
    else setError('');
    setLocalPrice(value);
  };

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
        onChange={changePrice}
        token={quote}
        error={error}
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
