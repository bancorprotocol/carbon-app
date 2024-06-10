import { Outlet, useSearch } from '@tanstack/react-router';
import { EditStrategyLayout } from 'components/strategies/edit/NewEditStrategyLayout';

export const EditPriceLayoutPage = () => {
  const { editType } = useSearch({
    from: '/strategies/edit/$strategyId/prices',
  });
  return (
    <EditStrategyLayout editType={editType}>
      <Outlet />
    </EditStrategyLayout>
  );
};
