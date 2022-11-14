import { MainMenu, MobileMenu } from 'elements/menu';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'routing';

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MainMenu />
      <main>
        <Outlet />
      </main>
      <MobileMenu />
    </QueryClientProvider>
  );
};
