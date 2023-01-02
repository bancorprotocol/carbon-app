import { MainMenu, MobileMenu } from 'components/menu';
import { Outlet } from 'libs/routing';

export const App = () => {
  return (
    <>
      <MainMenu />
      <main>
        <Outlet />
      </main>
      <MobileMenu />
    </>
  );
};
