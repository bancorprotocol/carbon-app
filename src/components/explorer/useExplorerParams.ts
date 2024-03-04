import { useParams } from 'libs/routing';

export const useExplorerParams = () => {
  const params = useParams({
    from: '/explore/$type/$slug/portfolio/token/$address',
  });

  // To support emojis in ens domains
  const decodedSlug = params.slug && decodeURIComponent(params.slug);

  return { ...params, slug: decodedSlug };
};
