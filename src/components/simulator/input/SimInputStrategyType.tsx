import { ReactNode } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconTwoRanges } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlappingStrategy } from 'assets/icons/overlapping.svg';
import { cn } from 'utils/helpers';
import { SimulatorType } from 'libs/routing/routes/sim';
import { Link, useSearch } from 'libs/routing';

interface ItemProps {
  title: string;
  label: SimulatorType;
  svg: ReactNode;
  tooltipText: string;
}

export const SimInputStrategyType = () => {
  const { baseToken, quoteToken, start, end } = useSearch({
    from: '/simulate/',
  });
  const items: ItemProps[] = [
    {
      title: 'Liquidity Position',
      label: 'overlapping',
      svg: <IconOverlappingStrategy className="size-14" />,
      tooltipText:
        'Choose between a Concentrated and a Full-Range liquidity position.',
    },
    {
      title: 'Recurring',
      label: 'recurring',
      svg: <IconTwoRanges className="size-14" />,
      tooltipText:
        'Create an automated trading cycle of buy low/sell high with two separate orders.',
    },
  ];

  return (
    <section className="p-16" key="simulatorTypeSelection">
      <header className="mb-16 flex items-center justify-between">
        <h2 className="text-18 font-weight-500 m-0">Type</h2>
      </header>
      <article role="tablist" className="grid grid-cols-2 gap-8">
        {items.map(({ title, label, svg, tooltipText }) => {
          const to = `/simulate/${label}` as const;
          return (
            <Link
              role="tab"
              id={'tab-' + label}
              aria-controls={'panel-' + label}
              key={label}
              to={to}
              search={{ baseToken, quoteToken, start, end }}
              className={cn(
                'rounded-10 text-14 font-weight-500 group flex size-full flex-row items-center justify-center gap-8 bg-black px-8 py-16 outline-white',
                'md:px-12',
                'focus-visible:outline focus-visible:outline-1',
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
          );
        })}
      </article>
    </section>
  );
};
