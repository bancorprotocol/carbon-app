import { useParams } from 'libs/routing';
import { ExplorerParams } from './utils';

export const useExplorerParams = () => {
  // TODO broken type inference
  // const params = useParams({ from: explorerResultLayout.fullPath });
  const params: ExplorerParams = useParams({ strict: false });

  // To support emojis in ens domains
  const decodedSlug = params.slug && decodeURIComponent(params.slug);

  return { ...params, slug: decodedSlug };
};
