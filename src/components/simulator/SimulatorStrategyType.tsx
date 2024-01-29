import { FC, useRef, KeyboardEvent } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconTwoRanges } from 'assets/icons/two-ranges.svg';
import { ReactComponent as IconOverlappingStrategy } from 'assets/icons/overlapping-strategy.svg';
import { cn } from 'utils/helpers';

interface Props {
  strategyType: string | undefined;
  setStrategyType: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const SimulatorStrategyType: FC<Props> = ({
  strategyType,
  setStrategyType,
}) => {
  const list = useRef<HTMLUListElement>(null);

  const items = [
    {
      label: 'Recurring',
      svg: <IconTwoRanges className="h-16 w-37" />,
      tooltipText: 'TBD',
    },
    {
      label: 'Overlapping',
      svg: <IconOverlappingStrategy className="h-16 w-37" />,
      tooltipText: 'TBD',
    },
  ];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const buttons = list.current?.querySelectorAll('button');
      if (!buttons) return;
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i] !== document.activeElement) continue;
        const nextIndex =
          e.key === 'ArrowRight'
            ? (i + 1) % buttons.length
            : (i - 1 + buttons.length) % buttons.length;
        return buttons[nextIndex].focus();
      }
    }
  };

  return (
    <section
      className="bg-secondary rounded-10 p-16"
      key="simulatorTypeSelection"
    >
      <header className="mb-16 flex items-center justify-between">
        <h2 className="m-0 text-18 font-weight-500">Strategy Type</h2>
      </header>
      <article>
        <ul
          onKeyDown={handleKeyDown}
          ref={list}
          role="tablist"
          className={`grid grid-cols-2 gap-8`}
        >
          {items.map(({ label, svg, tooltipText }) => (
            <li role="none" key={label} className="relative">
              <button
                id={'tab-' + label}
                role="tab"
                aria-controls={'panel-' + label}
                aria-selected={strategyType === label}
                onClick={() => setStrategyType(label)}
                className={cn(
                  'flex h-full w-full flex-row items-center justify-center gap-8 rounded-10 bg-black px-8 py-16 text-14 font-weight-500 outline-white/60',
                  'md:px-12',
                  'focus-visible:outline focus-visible:outline-1',
                  strategyType === label
                    ? 'outline outline-1 outline-white'
                    : ''
                )}
              >
                {svg}
                <span
                  className={`${
                    strategyType === label ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {label}
                </span>

                <Tooltip
                  iconClassName="!h-12 !w-12 text-white/60"
                  element={<div>{tooltipText}</div>}
                />
              </button>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
};