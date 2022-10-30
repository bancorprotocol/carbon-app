import { MainMenu } from 'elements/menu';
import { Router } from 'routing/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <MainMenu />
      </Router>
    </QueryClientProvider>
  );
};
