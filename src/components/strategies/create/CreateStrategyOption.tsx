import { FC, KeyboardEvent, SyntheticEvent, useRef } from 'react';
import { carbonEvents } from 'services/events';
import { strategyOptionItems } from 'components/strategies/create/strategyOptionItems';
import { ReactComponent as IconStar } from 'assets/icons/star-fill.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { cn } from 'utils/helpers';
import { Link, useNavigate, useSearch } from 'libs/routing';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { Token } from 'libs/tokens';
import { TradeTypeSearch, TradeTypeSelection } from 'libs/routing/routes/trade';
import { useTradePairs } from 'components/trade/useTradePairs';
import { NoTrade } from 'components/trade/NoTrade';

interface Props {
  base: Token;
  quote: Token;
}

export const CreateStrategyOption: FC<Props> = ({ base, quote }) => {
  const navigate = useNavigate({ from: '/trade/overview/type' });
  const { type } = useSearch({ strict: false }) as TradeTypeSearch;
  const { isTradePairError } = useTradePairs();

  const list = useRef<HTMLUListElement>(null);
  const items = strategyOptionItems();
  const selectedItem = (() => {
    if (!type) return items[0];
    const item = items.find(({ id }) => id === type);
    return item ?? items[0];
  })();
  const selectedId = selectedItem.id;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const btns = list.current?.querySelectorAll('button');
      if (!btns) return;
      for (let i = 0; i < btns.length; i++) {
        if (btns[i] !== document.activeElement) continue;
        const nextIndex =
          e.key === 'ArrowRight'
            ? (i + 1) % btns.length
            : (i - 1 + btns.length) % btns.length;
        return btns[nextIndex].focus();
      }
    }
  };

  const setItem = (type: TradeTypeSelection) => {
    document.querySelectorAll('details').forEach((d) => (d.open = false));
    navigate({
      search: (s) => ({ ...s, type }),
      replace: true,
      resetScroll: false,
    });
  };

  const toggleAccordion = (e: SyntheticEvent, id: string) => {
    const selector = `details[name="accordion-${id}"]`;
    const details = document.querySelectorAll<HTMLDetailsElement>(selector);
    for (const detail of details) {
      if (!detail.contains(e.target as Node)) detail.open = false;
    }
  };

  return (
    <>
      <ul
        ref={list}
        onKeyDown={handleKeyDown}
        role="tablist"
        className={`grid grid-cols-${items.length} gap-8`}
      >
        {items.map(({ isRecommended, svg, id, label }) => (
          <li role="none" key={id} className="relative">
            {isRecommended && (
              <span
                aria-labelledby={'legend-' + id}
                className="bg-primary-dark text-primary absolute right-8 top-8 rounded p-4"
              >
                <IconStar aria-hidden className="size-10" />
              </span>
            )}
            <button
              id={'tab-' + id}
              role="tab"
              aria-controls={'panel-' + id}
              aria-selected={id === selectedId}
              onClick={() => setItem(id)}
              className={cn(
                'rounded-10 text-10 flex size-full flex-col items-center justify-start gap-8 bg-black py-16 text-white/40 outline-1 outline-white/60',
                'focus-visible:outline',
                'aria-selected:text-white aria-selected:outline aria-selected:outline-white'
              )}
              data-testid={id}
            >
              {svg}
              {label}
            </button>
          </li>
        ))}
      </ul>
      {items.map(({ id, title, description, benefits, isRecommended }) => (
        <article
          role="tabpanel"
          id={'panel-' + id}
          aria-labelledby={'tab-' + id}
          key={id}
          className={cn(
            'flex flex-col gap-16',
            id === selectedId ? '' : 'hidden'
          )}
        >
          <hgroup>
            <h3 className="text-14 font-weight-500 mb-8">{title}</h3>
            <p className="text-12 text-white/80">{description}</p>
          </hgroup>
          <h4 className="text-12 font-weight-500">Benefits</h4>
          {benefits.map(({ summary, details }, i) => (
            <details
              key={i}
              /** @ts-ignore: name in details only work in chromium */
              name={'accordion-' + id}
            >
              <summary
                onClick={(e) => toggleAccordion(e, id)}
                className="text-12 mb-4 flex cursor-pointer items-center gap-8 text-white/80"
              >
                <IconCheck className="text-primary size-14" />
                {summary}
                <IconChevron className="toggle h-14 w-14" />
              </summary>
              <p className="pl-22 text-10 md:text-12 text-white/60">
                {details}
              </p>
            </details>
          ))}
          {isRecommended && (
            <p id={'legend-' + id} className="text-12 flex gap-8 text-white/40">
              <span className="bg-primary-dark text-primary rounded p-4">
                <IconStar aria-hidden className="size-10" />
              </span>
              Carbon Signature Feature
            </p>
          )}
        </article>
      ))}

      {selectedId === 'market' && isTradePairError && <NoTrade />}

      <Link
        to={selectedItem.to}
        params={{}}
        search
        className={cn(
          'mt-auto shrink-0',
          buttonStyles({ variant: 'success', fullWidth: true }),
          selectedItem
            ? ''
            : 'pointer-events-none cursor-not-allowed opacity-40'
        )}
        onClick={() => {
          carbonEvents.strategy.newStrategyNextStepClick({
            base,
            quote,
            strategyOption: selectedItem.id,
          });
        }}
      >
        Next Step
      </Link>
    </>
  );
};
