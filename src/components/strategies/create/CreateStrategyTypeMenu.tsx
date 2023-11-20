import { FC, KeyboardEvent, useEffect, useMemo, useRef } from 'react';
import { carbonEvents } from 'services/events';
import { m } from 'libs/motion';
import { Button } from 'components/common/button';
import { items as itemsVariant } from 'components/strategies/create/variants';
import { UseStrategyCreateReturn } from 'components/strategies/create/index';
import { useCreateStrategyTypeMenu } from 'components/strategies/create/useCreateStrategyTypeMenu';
import { ReactComponent as IconStar } from 'assets/icons/star-fill.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { cn } from 'utils/helpers';
import styles from './CreateStrategyTypeMenu.module.css';

export const CreateStrategyTypeMenu: FC<UseStrategyCreateReturn> = ({
  base,
  quote,
  strategyType,
  selectedStrategySettings,
  setSelectedStrategySettings,
}) => {
  const list = useRef<HTMLUListElement>(null);
  const { items, handleClick } = useCreateStrategyTypeMenu(
    base?.address!,
    quote?.address!
  );

  const selectedId = useMemo(() => {
    if (!selectedStrategySettings) return;
    const search = selectedStrategySettings.search;
    const item = items.find((item) => {
      return (
        item.search.strategySettings === search.strategySettings &&
        item.search.strategyDirection === search.strategyDirection
      );
    });
    return item?.id;
  }, [selectedStrategySettings, items]);

  useEffect(() => {
    if (!selectedStrategySettings) {
      setSelectedStrategySettings(items[0]);
    }
  }, [selectedStrategySettings, items, setSelectedStrategySettings]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const btns = list.current?.querySelectorAll('button');
      if (!btns) return;
      for (let i = 0; i < btns.length; i++) {
        if (btns[i] !== document.activeElement) continue;
        const nextIndex =
          e.key === 'ArrowRight'
            ? i + (1 % btns.length)
            : (i - 1 + btns.length) % btns.length;
        return btns[nextIndex].focus();
      }
    }
  };

  return (
    <>
      <m.div
        variants={itemsVariant}
        className="space-y-20 rounded-10 bg-silver p-20"
        key="createStrategyTypeMenu"
      >
        <h2>Strategy Type</h2>
        <ul
          ref={list}
          onKeyDown={handleKeyDown}
          role="tablist"
          className="flex gap-8"
        >
          {items.map(({ search, to, isRecommended, svg, id, label }) => (
            <li role="none" key={id} className="relative flex-1">
              {isRecommended && (
                <span
                  aria-label="Recommended"
                  className="absolute top-8 right-8 rounded bg-darkGreen p-4 text-green"
                >
                  <IconStar aria-hidden className="h-10 w-10" />
                </span>
              )}
              <button
                id={'tab-' + id}
                role="tab"
                aria-controls={'panel-' + id}
                aria-selected={selectedId === id}
                onClick={() => setSelectedStrategySettings({ to, search })}
                className={cn(
                  'flex h-full w-full flex-col items-center justify-start gap-8 rounded-10 bg-black px-12 py-16 text-14 outline-white/60',
                  'focus-visible:outline focus-visible:outline-1',
                  selectedId === id ? 'outline outline-white/80' : ''
                )}
                data-testid={id}
              >
                {svg}
                <span
                  className={selectedId === id ? 'text-white' : 'text-white/40'}
                >
                  {label}
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
              selectedId === id ? '' : 'hidden'
            )}
          >
            <hgroup>
              <h3 className="text-14 font-weight-500">{label}</h3>
              <p className="text-12 text-white/80">{description}</p>
            </hgroup>
            <h4 className="text-12 font-weight-500">Benefits</h4>
            {benefits.map(({ summary, details }, i) => (
              /** @ts-ignore: name in details only work in chromium */
              <details key={i} className={styles.details} name="accordion">
                <summary className="mb-4 flex cursor-pointer items-center gap-8 text-12 text-white/80">
                  <IconCheck className="h-14 w-14 text-green" />
                  {summary}
                  <IconChevron className={styles.chevron} />
                </summary>
                <p className="pl-22 text-10 text-white/60">{details}</p>
              </details>
            ))}
            {isRecommended && (
              <p className="flex gap-8 text-12 text-white/40">
                <span className="rounded bg-darkGreen p-4 text-green">
                  <IconStar aria-hidden className="h-10 w-10" />
                </span>
                Carbon Signature Features
              </p>
            )}
          </article>
        ))}
      </m.div>

      <Button
        variant="success"
        fullWidth
        size="lg"
        disabled={!selectedStrategySettings}
        onClick={() => {
          const search = selectedStrategySettings?.search;
          handleClick(
            selectedStrategySettings?.to!,
            selectedStrategySettings?.search!
          );
          carbonEvents.strategy.newStrategyNextStepClick({
            baseToken: base,
            quoteToken: quote,
            strategySettings: search?.strategySettings,
            strategyDirection: search?.strategyDirection,
            strategyType: strategyType,
          });
        }}
      >
        Next Step
      </Button>
    </>
  );
};
