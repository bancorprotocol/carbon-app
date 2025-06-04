import { Link, Pathnames, PathParams, useMatchRoute } from 'libs/routing';
import { ReactNode } from 'react';
import { cn } from 'utils/helpers';

export interface StrategyTab {
  label: string;
  href: Pathnames;
  params?: PathParams;
  icon: ReactNode;
  badge?: number;
}

interface Props {
  tabs: StrategyTab[];
  currentPathname: string;
}

export const StrategyPageTabs = ({ currentPathname, tabs }: Props) => {
  const match = useMatchRoute();
  return (
    <nav
      aria-label="Strategy Panels"
      className="border-background-900 text-14 mr-auto flex w-full gap-2 rounded-full border-2 p-6 md:w-auto"
    >
      {tabs.map(({ label, href, params, icon, badge }) => {
        const active = match({
          to: href,
          search: {},
          params: params,
          fuzzy:
            currentPathname.includes('/token/') && href.includes('portfolio'),
        });

        return (
          <Link
            to={href}
            params={params}
            key={href}
            className={cn(
              'flex w-full items-center justify-center gap-4 rounded-full py-5 md:px-10',
              active
                ? 'bg-white/10'
                : 'bg-transparent text-white/60 hover:text-white/80',
            )}
            aria-current={active ? 'location' : 'false'}
          >
            {icon}
            <span>{label}</span>
            {typeof badge === 'number' && (
              <span className="size-18 text-10 grid place-items-center rounded-full bg-white/10">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
