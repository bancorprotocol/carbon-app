import { Token } from 'libs/tokens';
import { FC, useId, useState } from 'react';
import { cn } from 'utils/helpers';
import { ReactComponent as IconCoinGecko } from 'assets/icons/coin-gecko.svg';
import { ReactComponent as IconEdit } from 'assets/icons/edit.svg';
import { TokenLogo } from 'components/common/imager/Imager';
import { Button } from 'components/common/button';
import { NewTabLink } from 'libs/routing';
import { DropdownMenu, MenuButtonProps } from 'components/common/dropdownMenu';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { InputLimit } from '../common/InputLimit';
import { Tooltip } from 'components/common/tooltip/Tooltip';

interface Props {
  base: Token;
  quote: Token;
  marketPrice?: string;
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
  const inputId = useId();
  const checkboxId = useId();
  const [localPrice, setLocalPrice] = useState(marketPrice?.toString() ?? '');
  const [showApproval, setShowApproval] = useState(false);
  const [approved, setApproved] = useState(
    localPrice === marketPrice?.toString()
  );
  const externalPrice = useMarketPrice({ base, quote });

  const changePrice = (value: string) => {
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
    <div className={cn(props.className, 'flex flex-col gap-16 p-16')}>
      {!externalPrice && <SetPriceText base={base} />}
      <Tooltip element="Price used to calculate concentrated liquidity strategy params">
        <label
          htmlFor={inputId}
          className="text-14 font-weight-500 flex items-center gap-4 text-white/80"
        >
          Enter <TokenLogo token={base} size={14} /> {base.symbol} market price
          ({quote.symbol} per 1 {base.symbol})
        </label>
      </Tooltip>
      <InputLimit
        id={inputId}
        price={localPrice}
        setPrice={changePrice}
        base={base}
        quote={quote}
        ignoreMarketPriceWarning
      />
      {showApproval && (
        <Warning>
          Warning, your market price will be used in the strategy creation flow
          and calculations.
        </Warning>
      )}
      <p className="text-12 text-white/60">
        By adjusting the market price, you alter the price range within which
        your concentrated liquidity strategy initiates.
        {!!externalPrice && <EditPriceText />}
      </p>
      {showApproval && (
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
