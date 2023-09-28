import { Link } from 'libs/routing';
import { cn, isPathnameMatch } from 'utils/helpers';

export interface StrategyTab {
  label: string;
  href: string;
  hrefMatches: string[];
  icon: JSX.Element;
  badge?: number;
}

interface Props {
  tabs: StrategyTab[];
  currentPathname: string;
}

export const StrategyPageTabs = ({ currentPathname, tabs }: Props) => {
  return (
    <nav
      aria-label="Strategy Panels"
      className="flex w-full gap-2 rounded-full border-2 border-silver p-6 md:w-auto"
    >
      {tabs.map(({ label, href, icon, badge, hrefMatches }) => (
        <Link
          to={href}
          key={href}
          className={cn(
            'flex w-full items-center justify-center gap-4 rounded-full py-5 md:px-10',
            isPathnameMatch(currentPathname, href, hrefMatches)
              ? 'bg-secondary'
              : 'bg-transparent'
          )}
          aria-current={
            isPathnameMatch(currentPathname, href, hrefMatches)
              ? 'location'
              : 'false'
          }
        >
          {icon}
          <span>{label}</span>
          {!!badge && (
            <span className="grid h-18 w-18 place-items-center rounded-full bg-white/10 text-10">
              {badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
};
