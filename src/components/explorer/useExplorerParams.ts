import { useParams } from 'libs/routing';

export const useExplorerParams = () => {
  // TODO broken type inference
  // const params = useParams({ from: explorerResultLayout.fullPath });
  const params = useParams({
    from: '/explorer/$type/$slug/portfolio/token/$address',
  });

  // To support emojis in ens domains
  const decodedSlug = params.slug && decodeURIComponent(params.slug);

  return { ...params, slug: decodedSlug };
};
