import { MainMenu, MobileMenu } from 'elements/menu';
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
