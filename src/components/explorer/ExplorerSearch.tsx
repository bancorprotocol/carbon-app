import { FC, FormEvent, memo, useEffect, useState } from 'react';
import { SuggestionCombobox } from 'components/explorer/suggestion/SuggestionCombobox';
import { useNavigate, useSearch } from 'libs/routing';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron-right.svg';
import { searchPairTrade, searchTokens, toPairSlug } from 'utils/pairSearch';
import { usePairs } from 'hooks/usePairs';
import { getEnsAddressIfAny, useGetAddressFromEns } from 'libs/queries';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useWagmi } from 'libs/wagmi';
import style from './ExplorerSearch.module.css';

interface Props {
  url: '/explore' | '/portfolio';
}
const LocalExplorerSearch: FC<Props> = ({ url }) => {
  const navigate = useNavigate({ from: url });
  const pairs = usePairs();
  const [open, setOpen] = useState(false);
  const { provider } = useWagmi();
  const params = useSearch({ from: url });
  const [search, setSearch] = useState(params.search ?? '');
  const [debouncedSearch] = useDebouncedValue<string>(search, 300); // Debounce search input for ens query

  const ensAddressQuery = useGetAddressFromEns(debouncedSearch.toLowerCase());

  const waitingToFetchEns =
    debouncedSearch !== search || !ensAddressQuery.isSuccess;

  useEffect(() => {
    if (!search) return setSearch('');
    const name = pairs.names.get(search);
    const displayName = name?.replace('_', '/').toUpperCase();
    return setSearch(displayName || '');
  }, [search, pairs.names]);

  const onSearchHandler = async (value?: string) => {
    if (!value?.length) {
      return navigate({
        to: '.',
        search: (s) => ({ ...s, search: undefined }),
      });
    }
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
      to: '.',
      search: (s) => ({ ...s, search: slug }),
    });
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const value = data.get('search')?.toString();
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
          <SuggestionCombobox url={url} open={open} setOpen={setOpen} />
        </div>
        <button type="submit">
          <IconChevron className="size-24" />
        </button>
      </form>
    </div>
  );
};

export const ExplorerSearch = memo(LocalExplorerSearch);
