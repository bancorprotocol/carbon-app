import { useMatch } from 'libs/routing';
import { ExplorerParams } from './utils';

export const useExplorerParams = () => {
  const match = useMatch({ strict: false });
  const params: ExplorerParams = match.params;

  // To support emojis in ens domains
  const decodedSlug = params.slug && decodeURIComponent(params.slug);

  return { ...params, slug: decodedSlug };
};
