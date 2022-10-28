import { MainMenu } from 'elements/menu';
import { Router } from 'routing/router';
import { Outlet } from '@tanstack/react-location';

export const App = () => {
  return (
    <Router>
      <MainMenu />
      <main className={'px-content'}>
        <Outlet />
      </main>
    </Router>
  );
};
