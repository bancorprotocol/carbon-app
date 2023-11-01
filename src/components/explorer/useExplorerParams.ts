import { useParams } from 'libs/routing';
import { ExplorerParams } from './utils';

export const useExplorerParams = () => {
  const params: ExplorerParams = useParams({ strict: false });

  // To support emojis in ens domains
  const decodedSlug = params.slug && decodeURIComponent(params.slug);

  return { ...params, slug: decodedSlug };
};
