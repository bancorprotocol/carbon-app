import { ExplorerType } from 'components/explorer/utils';

export const PathNames = {
  strategies: '/',
  portfolio: '/strategies/portfolio',
  portfolioToken: (address: string) => `/strategies/portfolio/token/${address}`,
  explorer: (type: ExplorerType) => `/explorer/${type}`,
  explorerOverview: (type: ExplorerType, slug: string) => {
    return `/explorer/${type}/${slug}`;
  },
  explorerPortfolio: (type: ExplorerType, slug: string) => {
    return `/explorer/${type}/${slug}/portfolio`;
  },
  explorerPortfolioToken: (
    type: ExplorerType,
    slug: string,
    address: string
  ) => {
    return `/explorer/${type}/${slug}/portfolio/token/${address}`;
  },
  trade: '/trade',
  debug: '/debug',
  createStrategy: '/strategies/create',
  editStrategy: '/strategies/edit',
  terms: '/terms',
  privacy: '/privacy',
};
