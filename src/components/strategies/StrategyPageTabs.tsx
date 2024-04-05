import { Link, Pathnames, PathParams, useMatchRoute } from 'libs/routing';
import { cn } from 'utils/helpers';

export interface StrategyTab {
  label: string;
  href: Pathnames;
  params?: PathParams;
  icon: JSX.Element;
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
      className="flex w-full gap-2 rounded-full border-2 border-background-900 p-6 text-14 md:w-auto"
    >
      {tabs.map(({ label, href, params, icon, badge }) => {
        const active = match({
          to: href,
          search: {},
          params: params ?? {},
          fuzzy:
            currentPathname.includes('/token/') && href.includes('portfolio'),
        });

        return (
          <Link
            to={href}
            // TODO: fix this
            params={params ?? {}}
            search={{}}
            key={href}
            className={cn(
              'flex w-full items-center justify-center gap-4 rounded-full py-5 md:px-10',
              active ? 'bg-white/10' : 'bg-transparent text-white/60'
            )}
            aria-current={active ? 'location' : 'false'}
          >
            {icon}
            <span>{label}</span>
            {!!badge && (
              <span className="grid h-18 w-18 place-items-center rounded-full bg-white/10 text-10">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
