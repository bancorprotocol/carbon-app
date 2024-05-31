import { FC, KeyboardEvent, SyntheticEvent, useRef } from 'react';
import { carbonEvents } from 'services/events';
import { m } from 'libs/motion';
import { items as itemsVariant } from 'components/strategies/create/variants';
import {
  StrategyTypeId,
  strategyTypeItems,
} from 'components/strategies/create/strategyTypeItems';
import { ReactComponent as IconStar } from 'assets/icons/star-fill.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { cn } from 'utils/helpers';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { Link, useNavigate, useSearch } from 'libs/routing';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { Token } from 'libs/tokens';

interface Props {
  base: Token;
  quote: Token;
}

export const CreateStrategyTypeMenu: FC<Props> = ({ base, quote }) => {
  const navigate = useNavigate({ from: '/strategies/create' });
  const { strategyTypeId } = useSearch({
    from: '/strategies/create',
  });
  const list = useRef<HTMLUListElement>(null);
  const items = strategyTypeItems(base.address, quote.address);
  const { aboveBreakpoint } = useBreakpoints();

  const selectedItem = (() => {
    if (!strategyTypeId) return items[0];
    const item = items.find(({ id }) => id === strategyTypeId);
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

  const setItem = (strategyTypeId: StrategyTypeId) => {
    document.querySelectorAll('details').forEach((d) => (d.open = false));
    navigate({
      search: (s) => ({ ...s, strategyTypeId }),
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
      <m.div
        variants={itemsVariant}
        className="rounded-10 bg-background-900 flex flex-col gap-20 p-20"
        key="createStrategyTypeMenu"
      >
        <h2>Strategy Type</h2>
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
                  'rounded-10 text-14 flex size-full flex-col items-center justify-start gap-8 bg-black px-8 py-16 outline-white/60',
                  'md:px-12',
                  'focus-visible:outline focus-visible:outline-1',
                  id === selectedId ? 'outline outline-1 outline-white' : ''
                )}
                data-testid={id}
              >
                {svg}
                <span
                  className={`text-12 md:text-14 ${
                    id === selectedId ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {aboveBreakpoint('md') ? label : label.split(' ')[0]}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {items.map(({ id, label, description, benefits, isRecommended }) => (
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
              <h3 className="text-14 font-weight-500 mb-8">{label}</h3>
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
              <p
                id={'legend-' + id}
                className="text-12 flex gap-8 text-white/40"
              >
                <span className="bg-primary-dark text-primary rounded p-4">
                  <IconStar aria-hidden className="size-10" />
                </span>
                Carbon Signature Feature
              </p>
            )}
          </article>
        ))}
      </m.div>

      <Link
        to={selectedItem.to}
        params={{}}
        search={selectedItem.search}
        className={cn(
          buttonStyles({ variant: 'success', fullWidth: true, size: 'lg' }),
          selectedItem
            ? ''
            : 'pointer-events-none cursor-not-allowed opacity-40'
        )}
        onClick={() => {
          carbonEvents.strategy.newStrategyNextStepClick({
            base,
            quote,
            strategyTypeId: selectedItem.id,
          });
        }}
      >
        Next Step
      </Link>
    </>
  );
};
