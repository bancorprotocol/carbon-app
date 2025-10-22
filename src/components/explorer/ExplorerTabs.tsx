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
  testid: string;
}

const tabs: ExplorerTab[] = [
  {
    label: 'Pairs',
    href: 'pairs',
    icon: <IconPairs className="hidden md:block size-24" />,
    testid: 'pairs-tab',
  },
  {
    label: 'Strategies',
    href: 'strategies',
    icon: <IconOverview className="hidden md:block size-24" />,
    testid: 'strategies-tab',
  },
  {
    label: 'Distribution',
    href: 'distribution',
    icon: <IconPieChart className="hidden md:block size-24" />,
    testid: 'distribution-tab',
  },
  {
    label: 'Activity',
    href: 'activity',
    icon: <IconActivity className="hidden md:block size-24" />,
    testid: 'activity-tab',
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
      aria-label="discover portfolio of strategies"
      className="tab-list text-16 sm:text-20 flex sm:place-self-start gap-8 md:gap-16 grid-area-[tabs] rounded-2xl"
      data-testid="explorer-tabs"
    >
      {tabs.map(({ label, href, search, icon, testid }) => {
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
            className="grow sm:grow-0 px-8 py-4 font-title font-normal text-white/60 flex gap-8 items-center justify-center sm:px-16 sm:py-8 aria-page:tab-focus tab-anchor"
            resetScroll={false}
            aria-current={active ? 'page' : 'false'}
            data-testid={testid}
          >
            {icon}
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
