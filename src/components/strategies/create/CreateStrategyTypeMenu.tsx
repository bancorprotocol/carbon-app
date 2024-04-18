import {
  FC,
  KeyboardEvent,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { carbonEvents } from 'services/events';
import { m } from 'libs/motion';
import { items as itemsVariant } from 'components/strategies/create/variants';
import { UseStrategyCreateReturn } from 'components/strategies/create/index';
import { getStrategyTypeItem } from 'components/strategies/create/useCreateStrategyTypeMenu';
import { ReactComponent as IconStar } from 'assets/icons/star-fill.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { cn } from 'utils/helpers';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { Link, StrategyCreateSearch } from 'libs/routing';
import styles from './CreateStrategyTypeMenu.module.css';
import { buttonStyles } from 'components/common/button/buttonStyles';

export const CreateStrategyTypeMenu: FC<UseStrategyCreateReturn> = ({
  base,
  quote,
  order0,
  order1,
  strategyType,
  selectedStrategySettings,
  setSelectedStrategySettings,
}) => {
  const list = useRef<HTMLUListElement>(null);
  const items = getStrategyTypeItem(base?.address!, quote?.address!);
  const { aboveBreakpoint } = useBreakpoints();

  useEffect(() => {
    if (selectedStrategySettings) return;
    const { to, search } = items[0];
    setSelectedStrategySettings({ to, search });
  });

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

  const selectSetting = (to: string, search: StrategyCreateSearch) => {
    setSelectedStrategySettings({ to, search });
    document.querySelectorAll('details').forEach((d) => (d.open = false));
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
          {items.map(({ search, to, isRecommended, svg, id, label }) => (
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
                aria-selected={selectedId === id}
                onClick={() => selectSetting(to, search)}
                className={cn(
                  'rounded-10 text-14 flex size-full flex-col items-center justify-start gap-8 bg-black px-8 py-16 outline-white/60',
                  'md:px-12',
                  'focus-visible:outline focus-visible:outline-1',
                  selectedId === id ? 'outline outline-1 outline-white' : ''
                )}
                data-testid={id}
              >
                {svg}
                <span
                  className={`text-12 md:text-14 ${
                    selectedId === id ? 'text-white' : 'text-white/40'
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
              selectedId === id ? '' : 'hidden'
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
                className={styles.details}
                /** @ts-ignore: name in details only work in chromium */
                name={'accordion-' + id}
              >
                <summary
                  onClick={(e) => toggleAccordion(e, id)}
                  className="text-12 mb-4 flex cursor-pointer items-center gap-8 text-white/80"
                >
                  <IconCheck className="text-primary size-14" />
                  {summary}
                  <IconChevron className={styles.chevron} />
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
        {...selectedStrategySettings}
        params={{}}
        className={cn(
          buttonStyles({ variant: 'success', fullWidth: true, size: 'lg' }),
          selectedStrategySettings
            ? ''
            : 'pointer-events-none cursor-not-allowed opacity-40'
        )}
        onClick={() => {
          if (!selectedStrategySettings) return;
          order0.resetFields();
          order1.resetFields();
          const search = selectedStrategySettings?.search;
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
      </Link>
    </>
  );
};
