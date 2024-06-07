import { Outlet, useSearch } from '@tanstack/react-router';
import { EditStrategyLayout } from 'components/strategies/edit/NewEditStrategyLayout';

export const EditBudgetLayoutPage = () => {
  const { action } = useSearch({ from: '/strategies/edit/$strategyId/budget' });
  return (
    <EditStrategyLayout type={action}>
      <Outlet />
    </EditStrategyLayout>
  );
};
