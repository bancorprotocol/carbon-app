import { Button } from 'components/common/button';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';
import { Link, PathNames } from 'libs/routing';
import { cn } from 'utils/helpers';

interface Props {
  strategyCount: number;
  currentPathname: string;
}

export const StrategyPageTabs = ({ strategyCount, currentPathname }: Props) => {
  const tabs = [
    {
      label: 'Overview',
      href: PathNames.strategies,
      icon: <IconOverview className={'h-18 w-18'} />,
      badge: strategyCount,
    },
    {
      label: 'Portfolio',
      href: PathNames.portfolio,
      icon: <IconPieChart className={'h-18 w-18'} />,
    },
  ];

  return (
    <div>
      <div
        className={cn(
          'inline-flex',
          'space-x-10',
          'rounded-full',
          'border-silver',
          'p-5',
          'border-2'
        )}
      >
        {tabs.map(({ label, href, icon, badge }) => (
          <Link to={href}>
            <Button variant={currentPathname === href ? 'secondary' : 'black'}>
              {icon}
              <span className={'ml-10'}>{label}</span>
              {badge !== undefined && (
                <span
                  className={
                    'ml-10 flex h-18 w-18 items-center justify-center rounded-full bg-white/10 text-10'
                  }
                >
                  {badge}
                </span>
              )}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};
