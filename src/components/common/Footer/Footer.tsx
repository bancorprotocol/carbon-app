import { FC } from 'react';
import { NewTabLink, externalLinks } from 'libs/routing';
import { ReactComponent as LogoCarbonDeFi } from 'assets/logos/carbondefi.svg';

export const Footer: FC = () => {
  return (
    <footer className="bg-body hidden items-center border-t border-emphasis py-24 px-20 md:flex">
      <NewTabLink
        aria-label="Powered By CarbonDeFi"
        to={externalLinks.carbonHomepage}
        className="flex h-16 items-center gap-8 whitespace-nowrap text-14 font-weight-500 text-white/60"
      >
        Powered by
        <LogoCarbonDeFi className="text-white" />
      </NewTabLink>
    </footer>
  );
};
