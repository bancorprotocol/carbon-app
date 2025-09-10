import { Link, Pathnames, useMatchRoute, useRouterState } from 'libs/routing';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconActivity } from 'assets/icons/activity.svg';
import { ReactComponent as IconPairs } from 'assets/icons/pairs.svg';
import { ReactNode } from 'react';

export interface ExplorerTab {
  label: string;
  href: Pathnames;
  search?: { search?: string };
  icon: ReactNode;
}

const tabs: ExplorerTab[] = [
  {
    label: 'Pairs',
    href: '/explore/pairs',
    icon: <IconPairs className="size-24 group-aria-page:fill-gradient" />,
  },
  {
    label: 'Strategies',
    href: '/explore/strategies',
    icon: <IconOverview className="size-24 group-aria-page:stroke-gradient" />,
  },
  {
    label: 'Distribution',
    href: '/explore/distribution',
    icon: <IconPieChart className="size-24 group-aria-page:stroke-gradient" />,
  },
  {
    label: 'Activity',
    href: '/explore/activity',
    icon: <IconActivity className="size-24 group-aria-page:stroke-gradient" />,
  },
];

export const ExplorerTabs = () => {
  // To support emojis in ens domains
  const { location } = useRouterState();
  const pathname = decodeURIComponent(location.pathname);
  const match = useMatchRoute();

  return (
    <nav
      aria-label="Strategy Panels"
      className="text-20 flex gap-16 rounded-full grid-area-[tabs]"
    >
      {tabs.map(({ label, href, search, icon }) => {
        const active = match({
          to: href,
          search,
          fuzzy: pathname.includes('/token/') && href.includes('portfolio'),
        });

        return (
          <Link
            to={href}
            search={(s) => s}
            key={href}
            className="group font-title font-medium bg-transparent text-white/60 hover:bg-background-900 flex gap-8 w-full items-center justify-center rounded-full px-16 py-8 aria-page:bg-background-800"
            aria-current={active ? 'page' : 'false'}
          >
            {icon}
            <span className="group-aria-page:text-gradient">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
