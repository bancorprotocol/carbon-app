import { FC, useEffect, useRef } from 'react';
import { MainMenuLeft } from 'components/core/menu/mainMenu/MainMenuLeft';
import { MainMenuRight } from 'components/core/menu/mainMenu/MainMenuRight';

export const MainMenu: FC = () => {
  const ref = useRef<HTMLHeadElement>(null);
  useEffect(() => {
    let top = true;
    const handler = () => {
      if (window.scrollY > 80) {
        if (!top) return;
        ref.current!.style.backgroundColor =
          'oklch(20% var(--chroma) var(--hue) / 0.5)';
        ref.current!.style.backdropFilter = 'blur(20px) saturate(150%)';
        top = false;
      } else {
        if (top) return;
        ref.current!.style.backgroundColor = 'transparent';
        ref.current!.style.backdropFilter = 'none';
        top = true;
      }
    };
    document.addEventListener('scroll', handler);
    return () => document.removeEventListener('scroll', handler);
  }, []);
  return (
    <header
      ref={ref}
      className="sticky top-0 z-40 w-full h-[80px] px-content font-medium flex items-center justify-between text-white/50 backdrop-mix"
      data-testid="main-menu"
    >
      <MainMenuLeft />
      <MainMenuRight />
    </header>
  );
};
