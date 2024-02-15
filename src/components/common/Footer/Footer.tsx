import { FC } from 'react';
import { ReactComponent as LogoCarbonDeFi } from 'assets/logos/carbondefi.svg';

export const Footer: FC = () => {
  return (
    <footer className="bg-body fixed bottom-0 left-0 z-10 hidden h-65 w-full items-center justify-start gap-8 border-t border-darkGrey py-16 px-20 md:flex">
      <span className="text-14 font-weight-500 text-white/60">Powered by </span>
      <LogoCarbonDeFi className="h-16 w-[114px]" />
    </footer>
  );
};
