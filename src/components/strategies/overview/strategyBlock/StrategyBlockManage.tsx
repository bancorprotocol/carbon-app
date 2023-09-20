import { FC } from 'react';
import { useStore } from 'store';
import { useModal } from 'hooks/useModal';
import { Strategy, StrategyStatus } from 'libs/queries';
import { PathNames, useMatch, useNavigate } from 'libs/routing';
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
import { useGetVoucherOwner } from 'libs/queries/chain/voucher';
import { cn } from 'utils/helpers';
import { ExplorerRouteGenerics } from 'components/explorer';

type itemsType = {
  id: StrategyEditOptionId;
  name: string;
  action?: () => void;
  disabled?: boolean;
};

type separatorCounterType = number;

interface Props {
  strategy: Strategy;
  manage: boolean;
  setManage: (flag: boolean) => void;
  isExplorer?: boolean;
}

export const StrategyBlockManage: FC<Props> = ({
  strategy,
  manage,
  setManage,
  isExplorer,
}) => {
  const { duplicate } = useDuplicateStrategy();
  const { openModal } = useModal();
  const navigate = useNavigate<EditStrategyLocationGenerics>();
  const order0 = useOrder(strategy.order0);
  const order1 = useOrder(strategy.order1);
  const {
    params: { type },
  } = useMatch<ExplorerRouteGenerics>();

  const owner = useGetVoucherOwner(
    manage && type === 'token-pair' ? strategy.id : undefined
  );

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
      id: 'duplicateStrategy',
      name: 'Duplicate Strategy',
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
      name: 'Manage Notifications',
      action: () => {
        carbonEvents.strategyEdit.strategyManageNotificationClick({
          ...strategyEventData,
          strategyId: strategy.id,
        });
        openModal('manageNotifications', { strategyId: strategy.id });
      },
    },
  ];

  if (isExplorer && type === 'token-pair') {
    items.push({
      id: 'walletOwner',
      name: 'View Owner’s Strategies',
      action: () => {
        navigate({
          to: PathNames.explorerOverview('wallet', owner.data ?? ''),
        });
      },
      disabled: !owner.data,
    });
  }

  if (!isExplorer) {
    items.push({
      id: 'editPrices',
      name: 'Edit Rates',
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
    });

    // separator
    items.push(0);

    items.push({
      id: 'depositFunds',
      name: 'Deposit Funds',
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
        name: 'Withdraw Funds',
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
        name: 'Pause Strategy',
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
        name: 'Renew Strategy',
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
      name: 'Delete Strategy',
      action: () => {
        carbonEvents.strategyEdit.strategyDeleteClick({
          ...strategyEventData,
          strategyId: strategy.id,
        });
        openModal('confirmStrategy', { strategy, type: 'delete' });
      },
    });
  }

  return (
    <DropdownMenu
      isOpen={manage}
      setIsOpen={setManage}
      button={(attr) => (
        <div className="rounded-20 bg-black">
          <Button
            {...attr}
            className="flex items-center justify-center gap-8"
            fullWidth
            variant="success-light"
          >
            Manage
            <IconChevron className="w-12" />
          </Button>
        </div>
      )}
      className="z-10 p-10"
    >
      {items.map((item) => {
        if (typeof item === 'number') {
          return <hr key={item} className="border-1  my-10 border-grey5" />;
        }

        const { name, id, action, disabled } = item;

        return (
          <ManageItem
            key={id}
            title={name}
            setManage={setManage}
            action={action}
            id={id}
            isExplorer={isExplorer}
            disabled={disabled}
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
  isExplorer?: boolean;
  disabled?: boolean;
}> = ({ title, id, setManage, action, isExplorer, disabled }) => {
  const tooltipText = getTooltipTextByStrategyEditOptionsId(isExplorer)?.[id];
  const { belowBreakpoint } = useBreakpoints();

  const Content = () => {
    return (
      <button
        type="button"
        onClick={() => {
          action && action();
          setManage(false);
        }}
        disabled={disabled}
        className={cn('w-full rounded-6 p-12 text-left', {
          'cursor-not-allowed': disabled,
          'opacity-60': disabled,
          'hover:bg-body': !disabled,
        })}
      >
        {title}
      </button>
    );
  };

  if (tooltipText) {
    return (
      <Tooltip
        disabled={belowBreakpoint('md')}
        element={tooltipText}
        interactive={false}
      >
        <Content />
      </Tooltip>
    );
  }

  return <Content />;
};
