import { Button } from 'components/common/button';
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
    <div
      className={cn(
        'h-40',
        'w-full md:w-auto',
        'flex',
        'space-x-10',
        'rounded-full',
        'border-silver',
        'border-2',
        'p-4'
      )}
    >
      {tabs.map(({ label, href, icon, badge, hrefMatches }) => (
        <Link to={href} key={href} className={'w-full'}>
          <Button
            variant={
              isPathnameMatch(currentPathname, href, hrefMatches)
                ? 'secondary'
                : 'black'
            }
            className={cn('h-full', '!w-full md:w-auto')}
          >
            {icon}
            <span className={'ml-10'}>{label}</span>
            {!!badge && (
              <span
                className={cn(
                  'ml-10',
                  'flex',
                  'h-18',
                  'w-18',
                  'items-center',
                  'justify-center',
                  'rounded-full',
                  'bg-white/10',
                  'text-10'
                )}
              >
                {badge}
              </span>
            )}
          </Button>
        </Link>
      ))}
    </div>
  );
};
