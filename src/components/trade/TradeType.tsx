import { useMemo } from 'react';
import IconPriceBased from 'assets/icons/price-based.svg?react';
import IconGradient from 'assets/icons/gradient.svg?react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import IconTooltip from 'assets/icons/tooltip.svg?react';
import { Link, TradeSearch, useRouterState } from 'libs/routing';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { gradientTypePages, staticTypePages } from './utils';
import IconChevron from 'assets/icons/chevron.svg?react';

const links = [
  {
    label: 'Price Based',
    svg: <IconPriceBased className="hidden size-16 md:inline" />,
    to: '/trade/overlapping' as const,
    text: '',
    testId: 'strategy-type-static',
    pages: staticTypePages,
  },
  {
    label: 'Gradient',
    svg: <IconGradient className="hidden size-16 md:inline" />,
    to: '/trade/auction' as const,
    text: '',
    testId: 'strategy-type-gradient',
    pages: gradientTypePages,
  },
];

export const TradeType = () => {
  const { location } = useRouterState();
  const current = location.pathname;

  const selected = useMemo(() => {
    return links.find((link) => link.pages.includes(current));
  }, [current]);

  return (
    <DropdownMenu
      placement="bottom"
      className="grid gap-8 rounded-2xl p-8"
      button={(attr) => (
        <button
          {...attr}
          className="bg-main-900 text-14 flex items-center gap-8 py-16 px-24 xl:max-2xl:rounded-s-md"
        >
          {selected?.svg}
          {selected?.label}
          <IconChevron className="ml-auto size-16" />
        </button>
      )}
    >
      {links.map((link, i) => (
        <Link
          key={i}
          to={link.to}
          from="/trade"
          search={(search: TradeSearch) => ({
            base: search.base,
            quote: search.quote,
            marketPrice: search.marketPrice,
          })}
          aria-current={link.pages.includes(current) ? 'page' : 'false'}
          data-testid={link.testId}
          className="rounded-md hover:surface flex items-center justify-center gap-8 py-8 px-16 text-white/60 aria-[current=page]:bg-main-900 aria-[current=page]:text-white"
        >
          {link.svg}
          {link.label}
          <Tooltip element={link.text}>
            <IconTooltip className="size-14" />
          </Tooltip>
        </Link>
      ))}
    </DropdownMenu>
  );
};
