import { Outlet } from '@tanstack/react-router';
import { EditStrategyLayout } from 'components/strategies/edit/NewEditStrategyLayout';

export const EditPriceLayoutPage = () => {
  return (
    <EditStrategyLayout type="editPrices">
      <Outlet />
    </EditStrategyLayout>
  );
};
