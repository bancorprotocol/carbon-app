import { Outlet, useSearch } from '@tanstack/react-router';
import { EditStrategyLayout } from 'components/strategies/edit/NewEditStrategyLayout';

export const EditBudgetLayoutPage = () => {
  const { editType } = useSearch({
    from: '/strategies/edit/$strategyId/budget',
  });
  return (
    <EditStrategyLayout editType={editType}>
      <Outlet />
    </EditStrategyLayout>
  );
};
