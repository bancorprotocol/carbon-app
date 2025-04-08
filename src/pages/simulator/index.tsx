import { Outlet } from '@tanstack/react-router';
import { useSimDisclaimer } from 'components/simulator/input/useSimDisclaimer';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { simulatorInputRootRoute } from 'libs/routing/routes/sim';
import { SimulatorMobilePlaceholder } from 'components/simulator/mobile-placeholder';
import { useEffect } from 'react';
import { lsService } from 'services/localeStorage';

export const SimulatorPage = () => {
  useSimDisclaimer();
  const searchState = simulatorInputRootRoute.useSearch();

  useEffect(() => {
    if (!searchState.baseToken || !searchState.quoteToken) return;
    lsService.setItem('tradePair', [
      searchState.baseToken,
      searchState.quoteToken,
    ]);
  }, [searchState.baseToken, searchState.quoteToken]);

  const { aboveBreakpoint } = useBreakpoints();

  if (!aboveBreakpoint('md')) return <SimulatorMobilePlaceholder />;

  return (
    <div className="mx-auto flex w-full max-w-[1920px] flex-col content-start gap-20 p-20 md:grid md:grid-cols-[450px_auto]">
      <Outlet />
    </div>
  );
};
