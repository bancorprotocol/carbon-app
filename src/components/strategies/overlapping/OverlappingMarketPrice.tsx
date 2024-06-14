import { Token } from 'libs/tokens';
import { FC, useId, useState } from 'react';
import { InputBudget } from '../common/InputBudget';
import { cn, prettifyNumber } from 'utils/helpers';
import { ReactComponent as IconCoinGecko } from 'assets/icons/coin-gecko.svg';
import { ReactComponent as IconEdit } from 'assets/icons/edit.svg';
import { LogoImager } from 'components/common/imager/Imager';
import { Button } from 'components/common/button';
import { NewTabLink } from 'libs/routing';
import { DropdownMenu, MenuButtonProps } from 'components/common/dropdownMenu';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { useMarketPrice } from 'hooks/useMarketPrice';

interface Props {
  base: Token;
  quote: Token;
  marketPrice?: number;
  setMarketPrice: (price: number) => void;
  className?: string;
}
export const OverlappingMarketPrice: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const Trigger = (attr: MenuButtonProps) => (
    <button
      {...attr}
      className={cn(
        'text-12 font-weight-500 bg-background-800 hover:bg-background-700 flex items-center justify-between gap-8 rounded-full px-16 py-8',
        props.className
      )}
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
  const { base, quote, marketPrice } = props;
  const checkboxId = useId();
  const [localPrice, setLocalPrice] = useState(marketPrice?.toString());
  const [showApproval, setShowApproval] = useState(false);
  const [approved, setApproved] = useState(
    localPrice === marketPrice?.toString()
  );
  const [error, setError] = useState('');
  const externalPrice = useMarketPrice({ base, quote });

  const changePrice = (value: string) => {
    if (!+value) setError('Price must be greater than 0');
    else setError('');
    setLocalPrice(value);
    setApproved(!!marketPrice && +value === +marketPrice);
    setShowApproval(!externalPrice || +value !== externalPrice);
  };

  const setPrice = () => {
    if (!localPrice) return;
    props.setMarketPrice(Number(localPrice));
    if (props.close) props.close();
  };

  const disabled = !localPrice || !+localPrice || (showApproval && !approved);

  return (
    <div className={cn(props.className, 'flex flex-col gap-20 p-16')}>
      {!externalPrice && <SetPriceText base={base} />}
      <InputBudget
        title={`Enter Market Price (${quote.symbol} per 1 ${base.symbol})`}
        titleTooltip="Price used to calculate concentrated liquidity strategy params"
        placeholder="Enter Price"
        value={localPrice}
        onChange={changePrice}
        token={quote}
        error={error}
        editType="deposit"
      />
      {!error && showApproval && (
        <Warning>
          Warning, your market price will be used in the strategy creation flow
          and calculations.
        </Warning>
      )}
      {!!externalPrice && (
        <div className="text-12 flex items-center justify-between rounded border border-white/10 p-16">
          <p className="text-white/80">CoinGecko Market Price</p>
          <button
            className="flex items-center gap-8"
            onClick={() => changePrice(externalPrice.toString())}
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
        By adjusting the market price, you alter the price range within which
        your concentrated liquidity strategy initiates.
        {!!externalPrice && <EditPriceText />}
      </p>
      {!error && showApproval && (
        <label
          htmlFor={checkboxId}
          className="rounded-10 text-12 font-weight-500 flex items-center gap-8 text-white/60"
        >
          <input
            id={checkboxId}
            type="checkbox"
            checked={approved}
            onChange={(e) => setApproved(e.target.checked)}
          />
          <span>I've reviewed the warning(s) but choose to proceed.</span>
        </label>
      )}
      <Button type="button" disabled={disabled} onClick={setPrice}>
        Confirm
      </Button>
    </div>
  );
};

const SetPriceText = ({ base }: { base: Token }) => (
  <p className="text-12 text-white/80">
    {base.symbol} market price is missing. To continue creating a strategy,
    enter its market price below.
  </p>
);

const EditPriceText = () => (
  <span>
    &nbsp;You can always return to the current market price. Market price
    provided by&nbsp;
    <NewTabLink
      className="text-primary inline-flex items-center gap-8"
      to="https://www.coingecko.com/"
    >
      <b>CoinGecko</b>
      <IconCoinGecko className="size-10" />
    </NewTabLink>
  </span>
);
