import { Pathnames, PathParams } from 'libs/routing';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';

export type GetPortfolioTokenHref = (row: PortfolioData) => {
  href: Pathnames;
  params: PathParams;
  search?: <T>(currentSearch: T) => T & { token: string };
};
