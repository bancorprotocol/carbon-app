import { FC } from 'react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { Button } from 'components/common/button';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { useDuplicateStrategy } from 'components/strategies/create/useDuplicateStrategy';
import { Strategy, StrategyStatus } from 'libs/queries';
import { useModal } from 'hooks/useModal';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import {
  StrategyEditOptionId,
  tooltipTextByStrategyEditOptionsId,
} from './utils';

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
  const { belowBreakpoint } = useBreakpoints();

  const items: itemsType[] = [
    {
      id: 'deleteStrategy',
      name: 'Delete Strategy',
      action: () => openModal('confirmStrategy', { strategy, type: 'delete' }),
    },
    {
      id: 'changeRates',
      name: 'Change Rates',
      action: () =>
        openModal('editStrategy', { strategy, type: 'changeRates' }),
    },
    {
      id: 'depositFunds',
      name: 'Deposit Funds',
      action: () =>
        openModal('editStrategyBudget', { strategy, type: 'deposit' }),
    },
  ];
  if (belowBreakpoint('md')) {
    items.push({
      id: 'duplicateStrategy',
      name: 'Duplicate Strategy',
      action: () => duplicate(strategy),
    });
  }
  if (strategy.status !== StrategyStatus.NoBudget) {
    items.push({
      id: 'withdrawFunds',
      name: 'Withdraw Funds',
      action: () =>
        openModal('editStrategyBudget', { strategy, type: 'withdraw' }),
    });
  }
  if (strategy.status === StrategyStatus.Active) {
    items.push({
      id: 'pauseStrategy',
      name: 'Pause Strategy',
      action: () => openModal('confirmStrategy', { strategy, type: 'pause' }),
    });
  }

  if (strategy.status === StrategyStatus.Paused) {
    items.push({
      id: 'renewStrategy',
      name: 'Renew Strategy',
      action: () => openModal('editStrategy', { strategy, type: 'renew' }),
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
          onClick={onClick}
        >
          Manage
          <IconChevron className="w-12" />
        </Button>
      )}
      className="w-full !p-10"
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
