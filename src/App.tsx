import { MainMenu, MobileMenu } from 'components/menu';
import { Outlet } from 'routing';

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
