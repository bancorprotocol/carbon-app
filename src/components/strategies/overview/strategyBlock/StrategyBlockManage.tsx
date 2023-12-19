import { isOverlappingStrategy } from 'components/strategies/overlapping/utils';
import { SafeDecimal } from 'libs/safedecimal';
import { FC } from 'react';
import { useStore } from 'store';
import { useModal } from 'hooks/useModal';
import { Strategy } from 'libs/queries';
import { PathNames, useNavigate, useParams } from 'libs/routing';
import { useDuplicateStrategy } from 'components/strategies/create/useDuplicateStrategy';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconGear } from 'assets/icons/gear.svg';
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
import { explorerEvents } from 'services/events/explorerEvents';
import { useStrategyCtx } from 'hooks/useStrategies';
import { strategyEditEvents } from 'services/events/strategyEditEvents';
import { ExplorerParams } from 'components/explorer/utils';

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
  const { strategies, sort, filter } = useStrategyCtx();
  const { duplicate } = useDuplicateStrategy();
  const { openModal } = useModal();
  const navigate = useNavigate();
  const order0 = useOrder(strategy.order0);
  const order1 = useOrder(strategy.order1);
  const { type, slug }: ExplorerParams = useParams({ strict: false });

  const owner = useGetVoucherOwner(
    manage && type === 'token-pair' ? strategy.id : undefined
  );

  const isOverlapping = isOverlappingStrategy(strategy);

  const strategyEventData = useStrategyEventData({
    base: strategy.base,
    quote: strategy.quote,
    order0,
    order1,
  });
  const strategyEvent = {
    ...strategyEventData,
    strategyId: strategy.id,
  };

  const {
    strategies: { setStrategyToEdit },
  } = useStore();

  const items: (itemsType | separatorCounterType)[] = [];

  if (
    !isOverlapping ||
    (isOverlapping &&
      (new SafeDecimal(strategy.order0.balance).gt(0) ||
        new SafeDecimal(strategy.order1.balance).gt(0)))
  ) {
    items.push({
      id: 'duplicateStrategy',
      name: 'Duplicate Strategy',
      action: () => {
        carbonEvents.strategyEdit.strategyDuplicateClick(strategyEvent);
        duplicate(strategy);
      },
    });
  }

  items.push({
    id: 'manageNotifications',
    name: 'Manage Notifications',
    action: () => {
      carbonEvents.strategyEdit.strategyManageNotificationClick(strategyEvent);
      openModal('manageNotifications', { strategyId: strategy.id });
    },
  });

  if (isExplorer && type === 'token-pair') {
    items.push({
      id: 'walletOwner',
      name: 'View Owner’s Strategies',
      action: () => {
        const event = { type, slug, strategyEvent, strategies, sort, filter };
        explorerEvents.viewOwnersStrategiesClick(event);
        navigate({
          to: PathNames.explorerOverview('wallet', owner.data ?? ''),
        });
      },
      disabled: !owner.data,
    });
  }

  if (!isExplorer) {
    if (!isOverlapping) {
      items.push({
        id: 'editPrices',
        name: 'Edit Prices',
        action: () => {
          setStrategyToEdit(strategy);
          carbonEvents.strategyEdit.strategyEditPricesClick({
            origin: 'manage',
            ...strategyEvent,
          });
          navigate({
            to: PathNames.editStrategy,
            search: { type: 'editPrices' },
          });
        },
      });
    }

    if (
      !isOverlapping ||
      (isOverlapping &&
        (new SafeDecimal(strategy.order0.balance).gt(0) ||
          new SafeDecimal(strategy.order1.balance).gt(0)))
    ) {
      // separator
      items.push(0);
      items.push({
        id: 'depositFunds',
        name: 'Deposit Funds',
        action: () => {
          setStrategyToEdit(strategy);
          carbonEvents.strategyEdit.strategyDepositClick(strategyEvent);
          navigate({
            to: PathNames.editStrategy,
            search: { type: 'deposit' },
          });
        },
      });
    }

    if (strategy.status !== 'noBudget') {
      items.push({
        id: 'withdrawFunds',
        name: 'Withdraw Funds',
        action: () => {
          carbonEvents.strategyEdit.strategyWithdrawClick(strategyEvent);

          if (isOverlapping) {
            setStrategyToEdit(strategy);
            navigate({
              to: PathNames.editStrategy,
              search: { type: 'withdraw' },
            });
          } else {
            openModal('confirmWithdrawStrategy', { strategy, strategyEvent });
          }
        },
      });
    }

    // separator
    items.push(1);

    if (strategy.status === 'active') {
      items.push({
        id: 'pauseStrategy',
        name: 'Pause Strategy',
        action: () => {
          carbonEvents.strategyEdit.strategyPauseClick(strategyEvent);
          openModal('confirmPauseStrategy', { strategy, strategyEvent });
        },
      });
    }

    if (strategy.status === 'paused') {
      items.push({
        id: 'renewStrategy',
        name: 'Renew Strategy',
        action: () => {
          carbonEvents.strategyEdit.strategyRenewClick(strategyEvent);
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
        carbonEvents.strategyEdit.strategyDeleteClick(strategyEvent);
        openModal('confirmDeleteStrategy', { strategy, strategyEvent });
      },
    });
  }

  return (
    <DropdownMenu
      isOpen={manage}
      setIsOpen={setManage}
      className="z-10 w-fit p-10"
      button={(attr) => (
        <button
          {...attr}
          onClick={(e) => {
            attr.onClick(e);
            if (isExplorer) {
              const baseEvent = { type, slug, strategies, sort, filter };
              explorerEvents.manageClick({ ...baseEvent, strategyEvent });
            } else {
              strategyEditEvents.strategyManageClick(strategyEvent);
            }
          }}
          role="menuitem"
          aria-label="Manage strategy"
          className={`
            self-center rounded-8 border-2 border-emphasis p-8
            hover:bg-white/10
            active:bg-white/20
          `}
        >
          <IconGear className="h-24 w-24" />
        </button>
      )}
    >
      <ul role="menu">
        {items.map((item) => {
          if (typeof item === 'number') {
            return <hr key={item} className="border-1  my-10 border-grey5" />;
          }

          const { name, id, action, disabled } = item;

          return (
            <li key={id} role="none">
              <ManageItem
                title={name}
                setManage={setManage}
                action={action}
                id={id}
                isExplorer={isExplorer}
                disabled={disabled}
              />
            </li>
          );
        })}
      </ul>
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
        role="menuitem"
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
