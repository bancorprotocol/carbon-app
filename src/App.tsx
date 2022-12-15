import { MainMenu, MobileMenu } from 'elements/menu';
import { useEffect } from 'react';
import { Outlet } from 'routing';

export const App = () => {
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
  }, []);

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
