import { MainMenu } from 'elements/menu';
import { MobileMenu } from 'elements/menu/mobileMenu/MobileMenu';
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
