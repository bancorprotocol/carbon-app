import { FC, FormEvent, memo, useEffect, useState } from 'react';
import ExplorerSearchSuggestions from 'components/explorer/suggestion';
import { useNavigate, useParams } from 'libs/routing';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron-right.svg';
import { searchPairTrade, searchTokens, toPairSlug } from 'utils/pairSearch';
import { usePairs } from 'hooks/usePairs';
import { getEnsAddressIfAny, useGetAddressFromEns } from 'libs/queries';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useWagmi } from 'libs/wagmi';
import style from './ExplorerSearch.module.css';

export const LocalExplorerSearch: FC = () => {
  const navigate = useNavigate();
  const pairs = usePairs();
  const [open, setOpen] = useState(false);
  const { provider } = useWagmi();
  const { slug } = useParams({ from: '/explore/$slug' });
  const [search, setSearch] = useState(slug ?? '');
  const [debouncedSearch] = useDebouncedValue<string>(search, 300); // Debounce search input for ens query

  const ensAddressQuery = useGetAddressFromEns(debouncedSearch.toLowerCase());

  const waitingToFetchEns =
    debouncedSearch !== search || !ensAddressQuery.isSuccess;

  useEffect(() => {
    if (!slug) return setSearch('');
    const name = pairs.names.get(slug);
    const displayName = name?.replace('_', '/').toUpperCase();
    return setSearch(displayName || '');
  }, [slug, pairs.names]);

  const onSearchHandler = async (value: string) => {
    if (value.length === 0) return;
    let slug = value;
    const filteredPairs = searchPairTrade(pairs.map, pairs.names, value);
    if (filteredPairs[0]) {
      const { baseToken, quoteToken } = filteredPairs[0];
      slug = toPairSlug(baseToken, quoteToken);
    }
    const filteredTokens = searchTokens(pairs.map, value);
    if (filteredTokens[0]) {
      slug = filteredTokens[0].address.toLowerCase();
    }
    if (value === slug) {
      slug = await getEnsAddressIfAny(provider, value);
    }
    navigate({
      to: '/explore/$slug',
      params: { slug },
    });
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const value = data.get('search')?.toString();
    if (!value) return;
    onSearchHandler(value);
    setOpen(false);
  };

  const resetHandler = (e: FormEvent<HTMLFormElement>) => {
    setSearch('');
    const selector = 'input[name="search"]';
    const input = (e.target as Element).querySelector<HTMLElement>(selector);
    input?.focus();
  };

  return (
    <div className={style.searchContainer}>
      <form
        className={style.search}
        role="search"
        onSubmit={submitHandler}
        onReset={resetHandler}
      >
        <IconSearch className="size-18" />
        <div className="flex items-center md:relative">
          <ExplorerSearchSuggestions open={open} setOpen={setOpen} />
        </div>
        <button type="submit">
          <IconChevron className="size-24" />
        </button>
      </form>
    </div>
  );
};

export const ExplorerSearch = memo(LocalExplorerSearch);
