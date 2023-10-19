import { useMatch } from '@tanstack/react-location';
import { ExplorerRouteGenerics } from './utils';

export const useExplorerParams = () => {
  const { params } = useMatch<ExplorerRouteGenerics>();

  // To support emojis in ens domains
  const decodedSlug = params.slug && decodeURIComponent(params.slug);

  return { ...params, slug: decodedSlug };
};
