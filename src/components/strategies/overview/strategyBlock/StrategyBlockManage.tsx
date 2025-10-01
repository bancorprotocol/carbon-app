import {
  isGradientStrategy,
  isFullRangeStrategy,
  isOverlappingStrategy,
  isPaused,
} from 'components/strategies/common/utils';
import { FC, forwardRef, ReactNode, useState } from 'react';
import { useModal } from 'hooks/useModal';
import { useNavigate, useSearch } from 'libs/routing';
import { DropdownMenu, MenuButtonProps } from 'components/common/dropdownMenu';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconGear } from 'assets/icons/gear.svg';
import {
  StrategyEditOptionId,
  getTooltipTextByStrategyEditOptionsId,
} from './utils';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useGetVoucherOwner } from 'libs/queries/chain/voucher';
import { cn } from 'utils/helpers';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { useIsStrategyOwner } from 'hooks/useIsStrategyOwner';
import { isDisposableStrategy } from 'components/strategies/common/utils';
import {
  getEditBudgetPage,
  getEditPricesPage,
} from 'components/strategies/edit/utils';
import config from 'config';
import { toPairSlug } from 'utils/pairSearch';
import { AnyStrategy } from 'components/strategies/common/types';
import { useDuplicate } from 'components/strategies/create/useDuplicateStrategy';
import { usePairs } from 'hooks/usePairs';

type itemsType = {
  id: StrategyEditOptionId;
  name: string;
  action?: () => void;
  disabled?: boolean;
};

type separatorCounterType = number;

interface Props {
  strategy: AnyStrategy;
  button: (props: ManageButtonProps) => ReactNode;
}

export const StrategyBlockManage: FC<Props> = (props) => {
  const { strategy } = props;
  const [manage, setManage] = useState(false);
  const { openModal } = useModal();
  const navigate = useNavigate();
  const { search } = useSearch({ strict: false });
  const { getType } = usePairs();
  const type = getType(search ?? '');
  const duplicate = useDuplicate();
  const { base, quote, buy, sell } = strategy;

  const isOwn = useIsStrategyOwner(strategy.id);

  const owner = useGetVoucherOwner(manage ? strategy.id : undefined);

  const isOverlapping = isOverlappingStrategy(strategy);
  const isDisposable = isDisposableStrategy(strategy);
  const isGradient = isGradientStrategy(strategy);

  const items: (itemsType | separatorCounterType)[] = [];

  if (!isGradient && !isPaused(strategy)) {
    items.push({
      id: 'duplicateStrategy',
      name: 'Duplicate Strategy',
      action: () => {
        if (isFullRangeStrategy(base, quote, buy, sell)) {
          duplicate(strategy);
        } else {
          openModal('duplicateStrategy', { strategy });
        }
      },
    });
  }

  if (!isPaused(strategy)) {
    items.push({
      id: 'trade',
      name: 'Trade this pair',
      action: () => {
        navigate({
          to: '/trade/market',
          search: {
            base: strategy.base.address,
            quote: strategy.quote.address,
          },
        });
      },
    });
  }

  if (config.ui.showSimulator && !isGradient && !isDisposable) {
    items.push({
      id: 'simulate',
      name: 'Simulate',
      action: () => {
        if (isOverlapping) {
          navigate({
            to: '/simulate/overlapping',
            search: {
              baseToken: strategy.base.address,
              quoteToken: strategy.quote.address,
              buyMin: strategy.buy.min,
              sellMax: strategy.sell.max,
            },
          });
        } else {
          navigate({
            to: '/simulate/recurring',
            search: {
              baseToken: strategy.base.address,
              quoteToken: strategy.quote.address,
              buyMin: strategy.buy.min,
              buyMax: strategy.buy.max,
              buyBudget: strategy.buy.budget,
              buyIsRange: strategy.buy.max !== strategy.buy.min,
              sellMin: strategy.sell.min,
              sellMax: strategy.sell.max,
              sellBudget: strategy.sell.budget,
              sellIsRange: strategy.sell.max !== strategy.sell.min,
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
        navigate({
          to: '/explore',
          search: { search: owner.data ?? '' },
        });
      },
      disabled: !owner.data,
    });
  }

  if (type === 'wallet') {
    items.push({
      id: 'explorePair',
      name: 'Explore Pair',
      action: () => {
        const slug = toPairSlug(strategy.base, strategy.quote);
        navigate({
          to: '/explore',
          search: { search: slug },
        });
      },
    });
  }

  if (isOwn) {
    if (!isGradientStrategy(strategy)) {
      const editPrices = getEditPricesPage(strategy, 'editPrices');

      items.push({
        id: 'editPrices',
        name: 'Edit Prices',
        action: () => {
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
            if (isOverlapping) {
              navigate({
                to: withdraw.to,
                search: withdraw.search,
                params: { strategyId: strategy.id },
              });
            } else {
              openModal('confirmWithdrawStrategy', { strategy });
            }
          },
        });
      }
    }

    // separator
    items.push(1);

    if (strategy.status === 'active') {
      items.push({
        id: 'pauseStrategy',
        name: 'Pause Strategy',
        action: () => {
          openModal('confirmPauseStrategy', { strategy });
        },
      });
    }

    if (!isGradient && strategy.status === 'paused') {
      const renew = getEditPricesPage(strategy, 'renew');
      items.push({
        id: 'renewStrategy',
        name: 'Renew Strategy',
        action: () => {
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
      name: 'Withdraw & Delete',
      action: () => {
        openModal('confirmDeleteStrategy', { strategy });
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
              <hr key={item} className="border  border-background-700 my-10" />
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
      'max-md:p-8 gap-8',
    );
    const { aboveBreakpoint } = useBreakpoints();
    return (
      <button {...props} className={style} ref={ref}>
        <IconGear className="size-24" />
        {aboveBreakpoint('md') && 'Manage'}
      </button>
    );
  },
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
        size-38 rounded-md border-background-800 grid place-items-center border-2
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
          if (action) action();
          setManage(false);
        }}
        disabled={disabled}
        className={cn('rounded-sm w-full p-12 text-left', {
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
