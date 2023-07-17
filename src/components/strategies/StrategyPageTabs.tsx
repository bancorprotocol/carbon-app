import { Button } from 'components/common/button';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';
import { Link, PathNames } from 'libs/routing';
import { cn, isPathnameMatch } from 'utils/helpers';

interface Props {
  strategyCount: number;
  currentPathname: string;
}

export const StrategyPageTabs = ({ strategyCount, currentPathname }: Props) => {
  const tabs = [
    {
      label: 'Overview',
      href: PathNames.strategies,
      hrefMatches: [PathNames.strategies],
      icon: <IconOverview className={'h-18 w-18'} />,
      badge: strategyCount,
    },
    {
      label: 'Portfolio',
      href: PathNames.portfolio,
      hrefMatches: [PathNames.portfolio, PathNames.portfolioToken('0x')],
      icon: <IconPieChart className={'h-18 w-18'} />,
    },
  ];

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
