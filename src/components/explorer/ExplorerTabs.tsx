import { Link, useMatchRoute, useRouterState } from 'libs/routing';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconActivity } from 'assets/icons/activity.svg';
import { ReactComponent as IconPairs } from 'assets/icons/pairs.svg';
import { ReactNode } from 'react';

export interface ExplorerTab {
  label: string;
  href: 'pairs' | 'strategies' | 'distribution' | 'activity';
  search?: { search?: string };
  icon: ReactNode;
}

const tabs: ExplorerTab[] = [
  {
    label: 'Pairs',
    href: 'pairs',
    icon: (
      <IconPairs className="hidden md:block size-24 group-aria-page:fill-gradient" />
    ),
  },
  {
    label: 'Strategies',
    href: 'strategies',
    icon: (
      <IconOverview className="hidden md:block size-24 group-aria-page:stroke-gradient" />
    ),
  },
  {
    label: 'Distribution',
    href: 'distribution',
    icon: (
      <IconPieChart className="hidden md:block size-24 group-aria-page:stroke-gradient" />
    ),
  },
  {
    label: 'Activity',
    href: 'activity',
    icon: (
      <IconActivity className="hidden md:block size-24 group-aria-page:stroke-gradient" />
    ),
  },
];

interface Props {
  url: '/explore' | '/portfolio';
}
export const ExplorerTabs = ({ url }: Props) => {
  // To support emojis in ens domains
  const { location } = useRouterState();
  const pathname = decodeURIComponent(location.pathname);
  const match = useMatchRoute();

  return (
    <nav
      aria-label="Strategy Panels"
      className="text-16 sm:text-20 flex sm:place-self-start gap-8 md:gap-16 rounded-full grid-area-[tabs]"
    >
      {tabs.map(({ label, href, search, icon }) => {
        const active = match({
          to: `${url}/${href}`,
          search,
          fuzzy: pathname.includes('/token/'),
        });

        return (
          <Link
            from={url}
            to={href}
            search={(s) => s}
            key={href}
            className="grow sm:grow-0 px-8 py-4 group font-title font-normal bg-transparent text-white/60 hover:bg-background-900 flex gap-8 items-center justify-center rounded-full sm:px-16 sm:py-8 aria-page:bg-background-800"
            aria-current={active ? 'page' : 'false'}
            resetScroll={false}
          >
            {icon}
            <span className="group-aria-page:text-gradient">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
