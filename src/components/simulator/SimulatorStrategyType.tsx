import { FC } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconTwoRanges } from 'assets/icons/two-ranges.svg';
import { ReactComponent as IconOverlappingStrategy } from 'assets/icons/overlapping-strategy.svg';
import { cn } from 'utils/helpers';
import { SimulatorType } from 'libs/routing/routes/sim';
import { Link } from '@tanstack/react-router';

interface Props {
  strategyType: SimulatorType;
}

interface ItemProps {
  label: SimulatorType;
  svg: JSX.Element;
  tooltipText: string;
}

export const SimulatorStrategyType: FC<Props> = ({ strategyType }) => {
  const items: ItemProps[] = [
    {
      label: 'recurring',
      svg: <IconTwoRanges className="h-16 w-37" />,
      tooltipText: 'TBD',
    },
    {
      label: 'overlapping',
      svg: <IconOverlappingStrategy className="h-16 w-37" />,
      tooltipText: 'TBD',
    },
  ];

  return (
    <section
      className="bg-secondary rounded-10 p-16"
      key="simulatorTypeSelection"
    >
      <header className="mb-16 flex items-center justify-between">
        <h2 className="m-0 text-18 font-weight-500">Strategy Type</h2>
      </header>
      <article role="tablist" className={`grid grid-cols-2 gap-8`}>
        {items.map(({ label, svg, tooltipText }) => (
          <Link
            role="tab"
            id={'tab-' + label}
            aria-controls={'panel-' + label}
            aria-selected={strategyType === label}
            key={label}
            to="/simulator/$simulationType"
            className={cn(
              'flex h-full w-full flex-row items-center justify-center gap-8 rounded-10 bg-black px-8 py-16 text-14 font-weight-500 outline-white/60',
              'md:px-12',
              'focus-visible:outline focus-visible:outline-1',
              strategyType === label ? 'outline outline-1 outline-white' : ''
            )}
            replace={true}
            resetScroll={false}
            params={{ simulationType: label }}
          >
            {svg}
            <span
              className={`capitalize ${
                strategyType === label ? 'text-white' : 'text-white/40'
              }`}
            >
              {label}
            </span>

            <Tooltip
              element={<div>{tooltipText}</div>}
              iconClassName="!h-12 !w-12 text-white/60"
            />
          </Link>
        ))}
      </article>
    </section>
  );
};