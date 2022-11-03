import { MainMenu } from 'elements/menu';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'routing';

export const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MainMenu />
      <main className={'px-content'}>
        <Outlet />
      </main>
    </QueryClientProvider>
  );
};
