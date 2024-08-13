import { FC } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconTwoRanges } from 'assets/icons/two-ranges.svg';
import { ReactComponent as IconOverlappingStrategy } from 'assets/icons/overlapping-strategy.svg';
import { cn } from 'utils/helpers';
import { SimulatorType } from 'libs/routing/routes/sim';
import { Link } from 'libs/routing';

interface ItemProps {
  title: string;
  label: SimulatorType;
  svg: JSX.Element;
  tooltipText: string;
}

interface Props {
  baseToken?: string;
  quoteToken?: string;
}

export const SimInputStrategyType: FC<Props> = ({ baseToken, quoteToken }) => {
  const items: ItemProps[] = [
    {
      title: 'Recurring',
      label: 'recurring',
      svg: <IconTwoRanges className="w-37 h-16" />,
      tooltipText:
        'Create buy and sell orders (limit or range) that are linked together. Newly acquired funds automatically rotate between them, creating an endless trading cycle without need for manual intervention.',
    },
    {
      title: 'Concentrated',
      label: 'overlapping',
      svg: <IconOverlappingStrategy className="w-37 h-16" />,
      tooltipText:
        'A concentrated position where you buy and sell in a custom price range, used to create a bid-ask fee tier that moves as the market does.',
    },
  ];

  return (
    <section
      className="rounded-10 bg-background-900 p-16"
      key="simulatorTypeSelection"
    >
      <header className="mb-16 flex items-center justify-between">
        <h2 className="text-18 font-weight-500 m-0">Strategy Type</h2>
      </header>
      <article role="tablist" className="grid grid-cols-2 gap-8">
        {items.map(({ title, label, svg, tooltipText }) => (
          <Link
            role="tab"
            id={'tab-' + label}
            aria-controls={'panel-' + label}
            key={label}
            to={`/simulate/${label}`}
            search={{ baseToken, quoteToken }}
            className={cn(
              'rounded-10 text-14 font-weight-500 group flex size-full flex-row items-center justify-center gap-8 bg-black px-8 py-16 outline-white',
              'md:px-12',
              'focus-visible:outline focus-visible:outline-1'
            )}
            inactiveProps={{
              className:
                'hover:outline hover:outline-1 hover:outline-background-400',
            }}
            activeProps={{ className: 'outline outline-1 outline-white' }}
            replace={true}
            resetScroll={false}
            params={{ simulationType: label }}
            data-testid={`select-type-${label}`}
          >
            {({ isActive }) => {
              return (
                <>
                  {svg}
                  <span
                    className={`capitalize ${
                      isActive
                        ? 'text-white'
                        : 'text-white/40 group-hover:text-white/80'
                    }`}
                  >
                    {title}
                  </span>
                  <Tooltip
                    element={<div>{tooltipText}</div>}
                    iconClassName="size-12 text-white/60"
                  />
                </>
              );
            }}
          </Link>
        ))}
      </article>
    </section>
  );
};
