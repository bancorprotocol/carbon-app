import { FC } from 'react';
import { NewTabLink, externalLinks } from 'libs/routing';
import { ReactComponent as LogoCarbonDeFi } from 'assets/logos/carbondefi.svg';

export const Footer: FC = () => {
  return (
    <footer className="border-main-800 flex items-center border-t bg-main-900/20 px-20 py-24 md:mb-0">
      <NewTabLink
        aria-label="Powered By CarbonDeFi"
        to={externalLinks.carbonHomepage}
        className="text-14 font-medium flex items-center gap-8 whitespace-nowrap text-white/60"
      >
        Powered by
        <LogoCarbonDeFi className="w-[114px] text-white" />
      </NewTabLink>
    </footer>
  );
};
