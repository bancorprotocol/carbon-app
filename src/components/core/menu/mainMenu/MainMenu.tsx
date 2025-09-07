import { FC, useEffect, useRef } from 'react';
import { MainMenuLeft } from 'components/core/menu/mainMenu/MainMenuLeft';
import { MainMenuRight } from 'components/core/menu/mainMenu/MainMenuRight';

export const MainMenu: FC = () => {
  const ref = useRef<HTMLHeadElement>(null);
  useEffect(() => {
    let top = true;
    const handler = () => {
      if (top !== window.scrollY < 80) {
        top = window.scrollY < 80;
        if (window.scrollY > 80) {
          ref.current!.style.backgroundColor = 'black';
        } else {
          ref.current!.style.backgroundColor = 'transparent';
        }
      }
    };
    document.addEventListener('scroll', handler);
    return () => document.removeEventListener('scroll', handler);
  }, []);
  return (
    <header
      ref={ref}
      className="sticky top-0 z-40 w-full h-[80px] px-content font-medium flex items-center justify-between text-white/50"
      data-testid="main-menu"
    >
      <MainMenuLeft />
      <MainMenuRight />
    </header>
  );
};
