import { FC } from 'react';
import { NewTabLink, externalLinks } from 'libs/routing';
import { ReactComponent as LogoCarbonDeFi } from 'assets/logos/carbondefi.svg';

export const Footer: FC = () => {
  return (
    <footer className="mb-80 flex items-center border-t border-background-800 bg-black py-24 px-20 md:mb-0">
      <NewTabLink
        aria-label="Powered By CarbonDeFi"
        to={externalLinks.carbonHomepage}
        className="flex items-center gap-8 whitespace-nowrap text-14 font-weight-500 text-white/60"
      >
        Powered by
        <LogoCarbonDeFi className="w-[114px] text-white" />
      </NewTabLink>
    </footer>
  );
};
