import { Token } from 'libs/tokens';
import { FC, FormEvent, useId, useMemo, useState } from 'react';
import { cn, roundSearchParam } from 'utils/helpers';
import { ReactComponent as IconCoinGecko } from 'assets/icons/coin-gecko.svg';
import { ReactComponent as IconEdit } from 'assets/icons/edit.svg';
import { Button } from 'components/common/button';
import { NewTabLink, useNavigate, useSearch } from 'libs/routing';
import { DropdownMenu, MenuButtonProps } from 'components/common/dropdownMenu';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { InputLimit } from './InputLimit';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import style from 'components/strategies/common/form.module.css';
import { useEditStrategyCtx } from '../edit/EditStrategyContext';
import { isOverlappingStrategy } from './utils';
import { getCalculatedPrice } from '../overlapping/utils';

interface Props {
  base: Token;
  quote: Token;
  className?: string;
}
export const EditMarketPrice: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const Trigger = (attr: MenuButtonProps) => (
    <button
      {...attr}
      className={cn(
        'text-12 font-weight-500 bg-background-800 hover:bg-background-700 flex items-center justify-between gap-8 rounded-full px-16 py-8',
        props.className,
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
      <InitMarketPrice
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

export const InitMarketPrice = (props: FieldProps) => {
  const { base, quote } = props;
  const strategy = useEditStrategyCtx()?.strategy;
  const inputId = useId();
  const checkboxId = useId();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const marketPrice = search.marketPrice;
  const { marketPrice: externalPrice } = useMarketPrice({ base, quote });
  const initPrice = roundSearchParam(marketPrice) || externalPrice?.toString();
  const [localPrice, setLocalPrice] = useState(initPrice);
  const [approved, setApproved] = useState(false);

  const calculatedPrice = useMemo(() => {
    if (!strategy || !isOverlappingStrategy(strategy)) return;
    return getCalculatedPrice(strategy);
  }, [strategy]);

  const setMarketPrice = (marketPrice?: string) => {
    navigate({
      search: (current: any) => ({ ...current, marketPrice }),
      replace: true,
      resetScroll: false,
    } as any);
  };

  const changePrice = (value: string) => {
    setLocalPrice(value);
    setApproved(!!marketPrice && value === marketPrice);
  };

  const isDisabled = (form: HTMLFormElement) => {
    if (!form.checkValidity()) return true;
    if (form.querySelector('.loading-message')) return true;
    if (form.querySelector('.error-message')) return true;
    const warnings = form.querySelector('.warning-message');
    if (!warnings) return false;
    return !(document.getElementById(checkboxId) as HTMLInputElement)?.checked;
  };

  const setPrice = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDisabled(e.currentTarget)) return;
    setMarketPrice(localPrice);
    if (props.close) props.close();
  };

  return (
    <div className="bg-gradient rounded-10 p-2 shadow-[0_0_12px_#A3A3A3] shadow-white">
      <form
        className={cn(
          props.className,
          style.form,
          'bg-background-900 rounded-10 grid gap-16 p-16',
        )}
        data-testid="user-price-form"
        onSubmit={setPrice}
      >
        {!externalPrice && <SetPriceText base={base} quote={quote} />}
        <InputLimit
          id={inputId}
          price={localPrice || ''}
          setPrice={changePrice}
          base={base}
          quote={quote}
          ignoreMarketPriceWarning
          required
        />
        {!externalPrice && !!calculatedPrice && (
          <Tooltip element="This price is the geometric mean of the strategy buy and sell marginal prices.">
            <button
              className="text-12 font-weight-500 text-primaryGradient-first hover:text-primary focus:text-primary active:text-primaryGradient-first"
              type="button"
              onClick={() => setLocalPrice(calculatedPrice)}
            >
              Use Strategy
            </button>
          </Tooltip>
        )}
        <p className="text-12 warning-message text-white/60">
          Updating the market price will automatically adjust all related data
          in the app.
          {!!externalPrice && <EditPriceText />}
        </p>
        <label
          htmlFor={checkboxId}
          className={cn(
            style.approveWarnings,
            'rounded-10 text-12 font-weight-500 flex items-center gap-8 text-white/60',
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
          I've reviewed the new market price and chosen to proceed.
        </label>
        <Button type="submit" data-testid="set-overlapping-price">
          Set New Market Price
        </Button>
      </form>
    </div>
  );
};

const SetPriceText = ({ base, quote }: { base: Token; quote: Token }) => (
  <hgroup className="grid gap-8">
    <h3 className="text-gradient">
      {base.symbol}/{quote.symbol} market price is unavailable.
    </h3>
    <p className="text-14 text-white/80">
      Enter the current market price to continue ({quote.symbol} per 1&nbsp;
      {base.symbol}).
    </p>
  </hgroup>
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
