import { MainMenu } from 'elements/menu';
import { Outlet } from 'routing';

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
