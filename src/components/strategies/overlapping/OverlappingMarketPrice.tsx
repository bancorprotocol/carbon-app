import { Token } from 'libs/tokens';
import { FC, useId, useState } from 'react';
import { BudgetInput } from '../common/BudgetInput';
import { cn, prettifyNumber } from 'utils/helpers';
import { ReactComponent as IconCoinGecko } from 'assets/icons/coin-gecko.svg';
import { ReactComponent as IconEdit } from 'assets/icons/edit.svg';
import { LogoImager } from 'components/common/imager/Imager';
import { Button } from 'components/common/button';
import { NewTabLink } from 'libs/routing';
import { DropdownMenu, MenuButtonProps } from 'components/common/dropdownMenu';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';

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
  const checkboxId = useId();
  const [localPrice, setLocalPrice] = useState(marketPrice);
  const [showApproval, setShowApproval] = useState(false);
  const [approved, setApproved] = useState(localPrice === marketPrice);
  const [error, setError] = useState('');

  const changePrice = (value: string) => {
    if (!+value) setError('Price must be greater than 0');
    else setError('');
    setLocalPrice(value);
    setApproved(!!marketPrice && +value === +marketPrice);
    setShowApproval(!externalPrice || +value !== externalPrice);
  };

  const setPrice = () => {
    if (!Number(localPrice)) return;
    props.setMarketPrice(localPrice);
    if (props.close) props.close();
  };

  const disabled = !+localPrice || (showApproval && !approved);

  return (
    <div className={cn(props.className, 'flex flex-col gap-20 p-16')}>
      {!externalPrice && <SetPriceText base={base} />}
      <BudgetInput
        title={`Enter Market Price (${quote.symbol} per 1${base.symbol})`}
        titleTooltip="Price used to calculate overlapping strategy params"
        value={localPrice}
        onChange={changePrice}
        token={quote}
        error={error}
        withoutWallet
      />
      {showApproval && (
        <WarningMessageWithIcon>
          Warning, your market price will be used in the strategy creation flow
          and calculations.
        </WarningMessageWithIcon>
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
        your overlapping strategy initiates.
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
    You can always return to the current market price. Market price provided
    by&nbsp;
    <NewTabLink
      className="text-primary inline-flex items-center gap-8"
      to="https://www.coingecko.com/"
    >
      <b>CoinGecko</b>
      <IconCoinGecko className="size-10" />
    </NewTabLink>
  </span>
);
