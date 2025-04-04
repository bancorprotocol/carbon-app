import { Token } from 'libs/tokens';
import { FC, FormEvent, useId, useState } from 'react';
import { cn, roundSearchParam } from 'utils/helpers';
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
import style from 'components/strategies/common/form.module.css';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';

interface Props {
  base: Token;
  quote: Token;
  marketPrice?: string;
  setMarketPrice: (price: string) => void;
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
      data-testid="edit-market-price"
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
      initialFocus={-1}
      button={Trigger}
    >
      <OverlappingInitMarketPrice
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

export const OverlappingInitMarketPrice = (props: FieldProps) => {
  const { base, quote, marketPrice } = props;
  const inputId = useId();
  const checkboxId = useId();
  const [localPrice, setLocalPrice] = useState(roundSearchParam(marketPrice));
  const [showApproval, setShowApproval] = useState(false);
  const [approved, setApproved] = useState(false);
  const { marketPrice: externalPrice } = useMarketPrice({ base, quote });

  const changePrice = (value: string) => {
    setLocalPrice(value);
    setApproved(!!marketPrice && value === marketPrice);
    setShowApproval(!externalPrice || +value !== externalPrice);
  };

  const isDisabled = (form: HTMLFormElement) => {
    if (!form.checkValidity()) return true;
    if (!!form.querySelector('.loading-message')) return true;
    if (!!form.querySelector('.error-message')) return true;
    const warnings = form.querySelector('.warning-message');
    if (!warnings) return false;
    return !(document.getElementById(checkboxId) as HTMLInputElement)?.checked;
  };

  const setPrice = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDisabled(e.currentTarget)) return;
    props.setMarketPrice(localPrice);
    if (props.close) props.close();
  };

  return (
    <form
      className={cn(props.className, style.form, 'grid gap-16 p-16')}
      data-testid="user-price-form"
      onSubmit={setPrice}
    >
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
        required
      />
      {showApproval && (
        <Warning>
          Warning, the defined market price will be used for strategy budget
          distribution.
        </Warning>
      )}
      <p className="text-12 text-white/60">
        By adjusting the market price, you alter the price range within which
        your concentrated liquidity strategy initiates.
        {!!externalPrice && <EditPriceText />}
      </p>
      <label
        htmlFor={checkboxId}
        className={cn(
          style.approveWarnings,
          'rounded-10 text-12 font-weight-500 flex items-center gap-8 text-white/60'
        )}
      >
        <input
          id={checkboxId}
          type="checkbox"
          className="size-18"
          data-testid="approve-price-warnings"
          checked={approved}
          onChange={(e) => setApproved(e.target.checked)}
        />
        I've reviewed the warning(s) but choose to proceed.
      </label>
      <Button type="submit" data-testid="set-overlapping-price">
        Confirm
      </Button>
    </form>
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

interface EditMarketPriceProps {
  base: Token;
  quote: Token;
  calculatedPrice?: string;
  setMarketPrice: (price: string) => any;
}

/** Market price input for edit price when there is no external market price or form is untouched  */
export const EditOverlappingMarketPrice: FC<EditMarketPriceProps> = (props) => {
  const { base, quote, calculatedPrice, setMarketPrice } = props;
  const [price, setPrice] = useState<string>();
  return (
    <>
      <hgroup>
        <h2 className="text-18 font-weight-500 flex-1">Market Price</h2>
        <p className="text-12 text-white/80">
          {base.symbol} market price is missing. Please provide the market price
          to enable price editing.
        </p>
      </hgroup>
      <Tooltip element="Price used to calculate concentrated liquidity strategy params">
        <label
          htmlFor="market-price-input"
          className="text-14 font-weight-500 flex items-center gap-4 text-white/80"
        >
          Enter <TokenLogo token={base} size={14} /> {base.symbol} market price
          ({quote.symbol} per 1 {base.symbol})
        </label>
      </Tooltip>
      <div className="rounded-16 border-warning flex cursor-text gap-5 border bg-black p-16">
        <input
          id="market-price-input"
          type="text"
          pattern={decimalNumberValidationRegex}
          inputMode="decimal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          aria-label="Enter Market Price"
          placeholder="Enter Market Price"
          className="text-18 font-weight-500 w-0 flex-1 text-ellipsis bg-transparent text-start focus:outline-none"
          data-testid="input-price"
        />
        {calculatedPrice && (
          <Tooltip element="This price is the geometric mean of the strategy buy and sell marginal prices.">
            <button
              className="text-12 font-weight-500 text-primaryGradient-first hover:text-primary focus:text-primary active:text-primaryGradient-first"
              type="button"
              onClick={() => setPrice(calculatedPrice)}
            >
              Use Strategy
            </button>
          </Tooltip>
        )}
      </div>
      <Button
        type="button"
        disabled={!price}
        onClick={() => price && setMarketPrice(price)}
      >
        Confirm
      </Button>
    </>
  );
};
