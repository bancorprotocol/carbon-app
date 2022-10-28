import { MainMenu } from 'elements/menu';
import { Outlet } from '@tanstack/react-location';

export const App = () => {
  return (
    <>
      <MainMenu />
      <main className={'px-content'}>
        <Outlet />
      </main>
    </>
  );
};
