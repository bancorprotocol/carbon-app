import { Outlet, useSearch } from '@tanstack/react-router';
import { EditStrategyLayout } from 'components/strategies/edit/NewEditStrategyLayout';

export const EditPriceLayoutPage = () => {
  const { type } = useSearch({ from: '/strategies/edit/$strategyId/prices' });
  return (
    <EditStrategyLayout type={type}>
      <Outlet />
    </EditStrategyLayout>
  );
};
