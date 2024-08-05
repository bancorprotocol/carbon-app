import { FC } from 'react';
import { Link, useRouterState, useSearch } from '@tanstack/react-router';
import { useStrategyCtx } from 'hooks/useStrategies';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconActivity } from 'assets/icons/activity.svg';

interface Props {
  current: 'overview' | 'portfolio' | 'activity';
}

export const TradeExplorerTab: FC<Props> = ({ current }) => {
  const { strategies } = useStrategyCtx();
  const { location } = useRouterState();
  const currentSearch = useSearch({ strict: false });
  const getHref = (page: 'overview' | 'portfolio' | 'activity') => {
    return location.href.replace(current, page);
  };
  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      href: getHref('overview'),
      icon: <IconOverview className="size-18" />,
      badge: strategies?.length || 0,
    },
    {
      key: 'portfolio',
      label: 'Portfolio',
      href: getHref('portfolio'),
      icon: <IconPieChart className="size-18" />,
    },
    {
      key: 'activity',
      label: 'Activity',
      href: getHref('activity'),
      icon: <IconActivity className="size-18" />,
    },
  ];
  return (
    <nav
      aria-label="Strategy Panels"
      className="border-background-900 text-14 mr-auto flex w-full gap-2 rounded-full border-2 p-6 md:w-auto"
    >
      {tabs.map(({ key, label, href, icon, badge }) => (
        <Link
          to={href}
          params={{}}
          search={{}}
          key={key}
          className="flex w-full items-center justify-center gap-4 rounded-full py-5 aria-[current=location]:bg-white/10 md:px-10"
          aria-current={key === current ? 'location' : 'false'}
        >
          {icon}
          <span>{label}</span>
          {!!badge && (
            <span className="size-18 text-10 grid place-items-center rounded-full bg-white/10">
              {badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
};
