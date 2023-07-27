import { FC } from 'react';
import { useStore } from 'store';
import { useModal } from 'hooks/useModal';
import { Strategy, StrategyStatus } from 'libs/queries';
import { PathNames, useNavigate } from 'libs/routing';
import { useDuplicateStrategy } from 'components/strategies/create/useDuplicateStrategy';
import { EditStrategyLocationGenerics } from 'components/strategies/edit/EditStrategyMain';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { Button } from 'components/common/button';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import {
  StrategyEditOptionId,
  getTooltipTextByStrategyEditOptionsId,
} from './utils';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useOrder } from 'components/strategies/create/useOrder';
import { useStrategyEventData } from 'components/strategies/create/useStrategyEventData';
import { carbonEvents } from 'services/events';
import { useTranslation } from 'libs/translations';

type itemsType = {
  id: StrategyEditOptionId;
  name: string;
  action?: () => void;
};

type separatorCounterType = number;

export const StrategyBlockManage: FC<{
  strategy: Strategy;
  manage: boolean;
  setManage: (flag: boolean) => void;
}> = ({ strategy, manage, setManage }) => {
  const { t } = useTranslation();
  const { duplicate } = useDuplicateStrategy();
  const { openModal } = useModal();
  const navigate = useNavigate<EditStrategyLocationGenerics>();
  const order0 = useOrder(strategy.order0);
  const order1 = useOrder(strategy.order1);

  const strategyEventData = useStrategyEventData({
    base: strategy.base,
    quote: strategy.quote,
    order0,
    order1,
  });

  const {
    strategies: { setStrategyToEdit },
  } = useStore();

  const items: (itemsType | separatorCounterType)[] = [
    {
      id: 'editPrices',
      name: t('pages.strategyOverview.card.manageStrategy.titles.title2'),
      action: () => {
        setStrategyToEdit(strategy);
        carbonEvents.strategyEdit.strategyChangeRatesClick({
          ...strategyEventData,
          strategyId: strategy.id,
        });
        navigate({
          to: PathNames.editStrategy,
          search: { type: 'editPrices' },
        });
      },
    },
    {
      id: 'duplicateStrategy',
      name: t('pages.strategyOverview.card.manageStrategy.titles.title5'),
      action: () => {
        carbonEvents.strategyEdit.strategyDuplicateClick({
          ...strategyEventData,
          strategyId: strategy.id,
        });
        duplicate(strategy);
      },
    },
    {
      id: 'manageNotifications',
      name: t('pages.strategyOverview.card.manageStrategy.titles.title8'),
      action: () => {
        carbonEvents.strategyEdit.strategyManageNotificationClick({
          ...strategyEventData,
          strategyId: strategy.id,
        });
        openModal('manageNotifications', { strategyId: strategy.id });
      },
    },
  ];

  // separator
  items.push(0);

  items.push({
    id: 'depositFunds',
    name: t('pages.strategyOverview.card.manageStrategy.titles.title3'),
    action: () => {
      setStrategyToEdit(strategy);
      carbonEvents.strategyEdit.strategyDepositClick({
        ...strategyEventData,
        strategyId: strategy.id,
      });
      navigate({
        to: PathNames.editStrategy,
        search: { type: 'deposit' },
      });
    },
  });

  if (strategy.status !== StrategyStatus.NoBudget) {
    items.push({
      id: 'withdrawFunds',
      name: t('pages.strategyOverview.card.manageStrategy.titles.title4'),
      action: () => {
        setStrategyToEdit(strategy);
        carbonEvents.strategyEdit.strategyWithdrawClick({
          ...strategyEventData,
          strategyId: strategy.id,
        });
        navigate({
          to: PathNames.editStrategy,
          search: { type: 'withdraw' },
        });
      },
    });
  }

  // separator
  items.push(1);

  if (strategy.status === StrategyStatus.Active) {
    items.push({
      id: 'pauseStrategy',
      name: t('pages.strategyOverview.card.manageStrategy.titles.title6'),
      action: () => {
        carbonEvents.strategyEdit.strategyPauseClick({
          ...strategyEventData,
          strategyId: strategy.id,
        });
        openModal('confirmStrategy', { strategy, type: 'pause' });
      },
    });
  }

  if (strategy.status === StrategyStatus.Paused) {
    items.push({
      id: 'renewStrategy',
      name: t('pages.strategyOverview.card.manageStrategy.titles.title7'),
      action: () => {
        carbonEvents.strategyEdit.strategyRenewClick({
          ...strategyEventData,
          strategyId: strategy.id,
        });
        setStrategyToEdit(strategy);
        navigate({
          to: PathNames.editStrategy,
          search: { type: 'renew' },
        });
      },
    });
  }

  items.push({
    id: 'deleteStrategy',
    name: t('pages.strategyOverview.card.manageStrategy.titles.title1'),
    action: () => {
      carbonEvents.strategyEdit.strategyDeleteClick({
        ...strategyEventData,
        strategyId: strategy.id,
      });
      openModal('confirmStrategy', { strategy, type: 'delete' });
    },
  });

  return (
    <DropdownMenu
      isOpen={manage}
      setIsOpen={setManage}
      button={(onClick) => (
        <div className="rounded-20 bg-black">
          <Button
            className="flex items-center justify-center gap-8"
            fullWidth
            variant={'success-light'}
            onClick={onClick}
          >
            {t('pages.strategyOverview.card.actionButtons.actionButton3')}
            <IconChevron className="w-12" />
          </Button>
        </div>
      )}
      className="z-10 w-full !p-10"
    >
      {items.map((item) => {
        if (typeof item === 'number') {
          return <hr key={item} className="border-1  my-10 border-grey5" />;
        }

        const { name, id, action } = item;

        return (
          <ManageItem
            key={id}
            title={name}
            setManage={setManage}
            action={action}
            id={id}
          />
        );
      })}
    </DropdownMenu>
  );
};

const ManageItem: FC<{
  title: string;
  id: StrategyEditOptionId;
  setManage: (flag: boolean) => void;
  action?: () => void;
}> = ({ title, id, setManage, action }) => {
  const { t } = useTranslation();
  const tooltipText = getTooltipTextByStrategyEditOptionsId(id, t);
  const { belowBreakpoint } = useBreakpoints();

  if (tooltipText) {
    return (
      <Tooltip
        disabled={belowBreakpoint('md')}
        element={tooltipText}
        interactive={false}
      >
        <div
          onClick={() => {
            action && action();
            setManage(false);
          }}
          className="hover:bg-body cursor-pointer rounded-6 p-12"
        >
          {title}
        </div>
      </Tooltip>
    );
  }

  return (
    <div
      onClick={() => {
        action && action();
        setManage(false);
      }}
      className="hover:bg-body cursor-pointer rounded-6 p-12"
    >
      {title}
    </div>
  );
};
