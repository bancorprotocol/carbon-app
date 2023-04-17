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
  tooltipTextByStrategyEditOptionsId,
} from './utils';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useOrder } from 'components/strategies/create/useOrder';
import { useStrategyEventData } from 'components/strategies/create/useStrategyEventData';
import { carbonEvents } from 'services/events';

type itemsType = {
  id: StrategyEditOptionId;
  name: string;
  action?: () => void;
};

export const StrategyBlockManage: FC<{
  strategy: Strategy;
  manage: boolean;
  setManage: (flag: boolean) => void;
}> = ({ strategy, manage, setManage }) => {
  const { duplicate } = useDuplicateStrategy();
  const { openModal } = useModal();
  const navigate = useNavigate<EditStrategyLocationGenerics>();
  const { belowBreakpoint } = useBreakpoints();
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

  const items: itemsType[] = [
    {
      id: 'deleteStrategy',
      name: 'Delete Strategy',
      action: () => {
        carbonEvents.strategyEdit.strategyDeleteClick({
          ...strategyEventData,
          strategyId: strategy.id,
        });
        openModal('confirmStrategy', { strategy, type: 'delete' });
      },
    },
    {
      id: 'editPrices',
      name: 'Edit Prices',
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
    },
  ];
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
  if (belowBreakpoint('md')) {
    items.push({
      id: 'duplicateStrategy',
      name: 'Duplicate Strategy',
      action: () => {
        carbonEvents.strategyEdit.strategyDuplicateClick({
          ...strategyEventData,
          strategyId: strategy.id,
        });
        duplicate(strategy);
      },
    });
  }
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

  return (
    <DropdownMenu
      isOpen={manage}
      setIsOpen={setManage}
      button={(onClick) => (
        <Button
          className="flex items-center justify-center gap-8"
          fullWidth
          variant={'black'}
          onClick={() => {
            onClick();
            carbonEvents.strategyEdit.strategyManageClick({
              ...strategyEventData,
              strategyId: strategy.id,
            });
          }}
        >
          Manage
          <IconChevron className="w-12" />
        </Button>
      )}
      className="z-10 w-full !p-10"
    >
      {items.map(({ name, action, id }) => (
        <ManageItem
          key={id}
          title={name}
          setManage={setManage}
          action={action}
          id={id}
        />
      ))}
    </DropdownMenu>
  );
};

const ManageItem: FC<{
  title: string;
  id: StrategyEditOptionId;
  setManage: (flag: boolean) => void;
  action?: () => void;
}> = ({ title, id, setManage, action }) => {
  const tooltipText = tooltipTextByStrategyEditOptionsId?.[id];

  if (tooltipText) {
    return (
      <Tooltip element={tooltipText} interactive={false}>
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
