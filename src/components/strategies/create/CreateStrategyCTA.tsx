import { Button } from 'components/common/button';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { Link, PathNames } from 'libs/routing';
import { useTranslation } from 'libs/translations';
import { carbonEvents } from 'services/events';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { cn } from 'utils/helpers';

export const CreateStrategyCTA = () => {
  const { t } = useTranslation();
  const { belowBreakpoint } = useBreakpoints();

  return (
    <Link to={PathNames.createStrategy}>
      <Button
        variant="success"
        onClick={() => carbonEvents.strategy.newStrategyCreateClick(undefined)}
        className={cn({
          'flex h-56 w-56 items-center justify-center rounded-full !p-0':
            belowBreakpoint('md'),
        })}
      >
        {belowBreakpoint('md') ? (
          <IconPlus className={'h-14 w-14'} />
        ) : (
          t('pages.strategyOverview.header.actionButtons.actionButton1')
        )}
      </Button>
    </Link>
  );
};
