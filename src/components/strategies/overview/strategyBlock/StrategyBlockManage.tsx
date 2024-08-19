import {
  isOverlappingStrategy,
  isPaused,
} from 'components/strategies/common/utils';
import { FC, forwardRef, useState } from 'react';
import { useModal } from 'hooks/useModal';
import { Strategy } from 'libs/queries';
import { useNavigate, useParams } from 'libs/routing';
import { DropdownMenu, MenuButtonProps } from 'components/common/dropdownMenu';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconGear } from 'assets/icons/gear.svg';
import {
  StrategyEditOptionId,
  getTooltipTextByStrategyEditOptionsId,
} from './utils';
import { useBreakpoints } from 'hooks/useBreakpoints';
import {
  toStrategyEventParams,
  useStrategyEvent,
} from 'components/strategies/create/useStrategyEventData';
import { carbonEvents } from 'services/events';
import { useGetVoucherOwner } from 'libs/queries/chain/voucher';
import { cn } from 'utils/helpers';
import { explorerEvents } from 'services/events/explorerEvents';
import { useStrategyCtx } from 'hooks/useStrategies';
import { strategyEditEvents } from 'services/events/strategyEditEvents';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { useIsStrategyOwner } from 'hooks/useIsStrategyOwner';
import { isDisposableStrategy } from 'components/strategies/common/utils';
import {
  getEditBudgetPage,
  getEditPricesPage,
} from 'components/strategies/edit/utils';
import config from 'config';
import { toPairSlug } from 'utils/pairSearch';

type itemsType = {
  id: StrategyEditOptionId;
  name: string;
  action?: () => void;
  disabled?: boolean;
};

type separatorCounterType = number;

interface Props {
  strategy: Strategy;
  button: (props: ManageButtonProps) => JSX.Element;
}

export const StrategyBlockManage: FC<Props> = (props) => {
  const { strategy } = props;
  const [manage, setManage] = useState(false);
  const { strategies, sort, filter } = useStrategyCtx();
  const { openModal } = useModal();
  const navigate = useNavigate();
  const { type, slug } = useParams({ from: '/explore/$type/$slug' });

  const isOwn = useIsStrategyOwner(strategy.id);

  const owner = useGetVoucherOwner(manage ? strategy.id : undefined);

  const isOverlapping = isOverlappingStrategy(strategy);

  const strategyEventData = useStrategyEvent(toStrategyEventParams(strategy));
  const strategyEvent = {
    ...strategyEventData,
    strategyId: strategy.id,
  };

  const items: (itemsType | separatorCounterType)[] = [];

  if (!isPaused(strategy)) {
    items.push({
      id: 'duplicateStrategy',
      name: 'Duplicate Strategy',
      action: () => {
        carbonEvents.strategyEdit.strategyDuplicateClick(strategyEvent);
        openModal('duplicateStrategy', { strategy });
      },
    });
  }

  const isDisposable = isDisposableStrategy(strategy);

  if (!isDisposable && config.isSimulatorEnabled) {
    items.push({
      id: 'simulate',
      name: 'Simulate Strategy',
      action: () => {
        if (isOverlapping) {
          navigate({
            to: '/simulate/overlapping',
            search: {
              baseToken: strategy.base.address,
              quoteToken: strategy.quote.address,
              buyMin: strategy.order0.startRate,
              sellMax: strategy.order1.endRate,
            },
          });
        } else {
          navigate({
            to: '/simulate/recurring',
            search: {
              baseToken: strategy.base.address,
              quoteToken: strategy.quote.address,
              buyMin: strategy.order0.startRate,
              buyMax: strategy.order0.endRate,
              buyBudget: strategy.order0.balance,
              buyIsRange: strategy.order0.endRate !== strategy.order0.startRate,
              sellMin: strategy.order1.startRate,
              sellMax: strategy.order1.endRate,
              sellBudget: strategy.order1.balance,
              sellIsRange:
                strategy.order1.endRate !== strategy.order1.startRate,
            },
          });
        }
      },
    });
  }

  if (!isOwn && type !== 'wallet') {
    items.push({
      id: 'walletOwner',
      name: "View Owner's Strategies",
      action: () => {
        const event = { type, slug, strategyEvent, strategies, sort, filter };
        explorerEvents.viewOwnersStrategiesClick(event);
        navigate({
          to: '/explore/$type/$slug',
          params: { type: 'wallet', slug: owner.data ?? '' },
        });
      },
      disabled: !owner.data,
    });
  }

  if (type !== 'token-pair') {
    items.push({
      id: 'explorePair',
      name: 'Explore Pair',
      action: () => {
        const slug = toPairSlug(strategy.base, strategy.quote);
        const event = { type, slug, strategies, filter, sort };
        explorerEvents.search(event);
        navigate({
          to: '/explore/$type/$slug',
          params: { type: 'token-pair', slug },
        });
      },
    });
  }

  if (isOwn) {
    const editPrices = getEditPricesPage(strategy, 'editPrices');

    items.push({
      id: 'editPrices',
      name: 'Edit Prices',
      action: () => {
        carbonEvents.strategyEdit.strategyEditPricesClick({
          origin: 'manage',
          ...strategyEvent,
        });
        navigate({
          to: editPrices.to,
          search: editPrices.search,
          params: { strategyId: strategy.id },
        });
      },
    });

    const deposit = getEditBudgetPage(strategy, 'deposit');

    // separator
    items.push(0);
    items.push({
      id: 'depositFunds',
      name: 'Deposit Funds',
      action: () => {
        carbonEvents.strategyEdit.strategyDepositClick(strategyEvent);
        navigate({
          to: deposit.to,
          search: deposit.search,
          params: { strategyId: strategy.id },
        });
      },
    });

    if (strategy.status !== 'noBudget') {
      const withdraw = getEditBudgetPage(strategy, 'withdraw');
      items.push({
        id: 'withdrawFunds',
        name: 'Withdraw Funds',
        action: () => {
          carbonEvents.strategyEdit.strategyWithdrawClick(strategyEvent);

          if (isOverlapping) {
            navigate({
              to: withdraw.to,
              search: withdraw.search,
              params: { strategyId: strategy.id },
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
      const renew = getEditPricesPage(strategy, 'renew');
      items.push({
        id: 'renewStrategy',
        name: 'Renew Strategy',
        action: () => {
          carbonEvents.strategyEdit.strategyRenewClick(strategyEvent);
          navigate({
            to: renew.to,
            search: renew.search,
            params: { strategyId: strategy.id },
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
      button={(attr) => {
        return props.button({
          ...attr,
          onClick: (e) => {
            attr.onClick(e);
            if (!isOwn) {
              const baseEvent = { type, slug, strategies, sort, filter };
              explorerEvents.manageClick({ ...baseEvent, strategyEvent });
            } else {
              strategyEditEvents.strategyManageClick(strategyEvent);
            }
          },
          role: 'menuitem',
          'aria-label': 'Manage strategy',
          'data-testid': 'manage-strategy-btn',
        });
      }}
    >
      <ul role="menu" data-testid="manage-strategy-dropdown">
        {items.map((item) => {
          if (typeof item === 'number') {
            return (
              <hr
                key={item}
                className="border-1  border-background-700 my-10"
              />
            );
          }

          const { name, id, action, disabled } = item;

          return (
            <ManageItem
              key={id}
              title={name}
              setManage={setManage}
              action={action}
              id={id}
              isOwn={isOwn}
              disabled={disabled}
            />
          );
        })}
      </ul>
    </DropdownMenu>
  );
};

interface ManageButtonProps extends MenuButtonProps {
  role: 'menuitem';
  'aria-label': string;
  'data-testid': string;
}

export const ManageButton = forwardRef<HTMLButtonElement, ManageButtonProps>(
  function ManageButton(props, ref) {
    const style = cn(
      buttonStyles({ variant: 'secondary' }),
      'max-md:p-8 gap-8'
    );
    const { aboveBreakpoint } = useBreakpoints();
    return (
      <button {...props} className={style} ref={ref}>
        <IconGear className="size-24" />
        {aboveBreakpoint('md') && 'Manage'}
      </button>
    );
  }
);

export const ManageButtonIcon = forwardRef<
  HTMLButtonElement,
  ManageButtonProps
>(function ManageButtonIcon(props, ref) {
  return (
    <button
      {...props}
      ref={ref}
      className={`
        size-38 rounded-8 border-background-800 grid place-items-center border-2
        hover:bg-white/10
        active:bg-white/20
      `}
    >
      <IconGear className="size-24" />
    </button>
  );
});

const ManageItem: FC<{
  title: string;
  id: StrategyEditOptionId;
  setManage: (flag: boolean) => void;
  action?: () => void;
  isOwn?: boolean;
  disabled?: boolean;
}> = ({ title, id, setManage, action, isOwn, disabled }) => {
  const tooltipText = getTooltipTextByStrategyEditOptionsId(isOwn)?.[id];
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
        className={cn('rounded-6 w-full p-12 text-left', {
          'cursor-not-allowed': disabled,
          'opacity-60': disabled,
          'hover:bg-black': !disabled,
        })}
        data-testid={`manage-strategy-${id}`}
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
        <li role="none">
          <Content />
        </li>
      </Tooltip>
    );
  }

  return (
    <li role="none">
      <Content />
    </li>
  );
};
