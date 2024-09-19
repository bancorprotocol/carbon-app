import { useParams } from 'libs/routing';

type ExplorerUrl =
  | '/explore/$type'
  | '/explore/$type/$slug'
  | '/explore/$type/$slug/activity'
  | '/explore/$type/$slug/portfolio'
  | '/explore/$type/$slug/portfolio/token/$address';

export const useExplorerParams = <T extends ExplorerUrl>(url: T) => {
  const params = useParams({ from: url });
  if ('slug' in params) {
    // To support emojis in ens domains
    return { ...params, slug: decodeURIComponent(params.slug) };
  } else {
    return { ...params, slug: undefined };
  }
};
