import { FC, FormEvent, memo, useCallback, useEffect, useState } from 'react';
import { SuggestionCombobox } from 'components/explorer/suggestion/SuggestionCombobox';
import { useNavigate, useSearch } from 'libs/routing';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron-right.svg';
import {
  searchPairTrade,
  searchTokens,
  toPairName,
  toPairSlug,
} from 'utils/pairSearch';
import { usePairs } from 'hooks/usePairs';
import { getEnsAddressIfAny } from 'libs/queries';
import { useWagmi } from 'libs/wagmi';
import { TradePair } from 'components/strategies/common/types';
import { Token } from 'libs/tokens';
import { useTokens } from 'hooks/useTokens';
import style from './ExplorerSearch.module.css';

const displaySlug = (
  slug: string,
  pairMap: Map<string, TradePair>,
  tokensMap: Map<string, Token>,
) => {
  if (tokensMap.has(slug)) {
    return tokensMap.get(slug)?.symbol ?? '';
  } else if (pairMap.has(slug)) {
    const pair = pairMap.get(slug)!;
    return toPairName(pair.baseToken, pair.quoteToken);
  } else {
    return slug;
  }
};

interface Props {
  url: '/explore' | '/portfolio';
}
const LocalExplorerSearch: FC<Props> = ({ url }) => {
  const navigate = useNavigate({ from: url });
  const { tokensMap } = useTokens();
  const { map: pairMap, names: namesMap } = usePairs();
  const [open, setOpen] = useState(false);
  const { provider } = useWagmi();
  const params = useSearch({ from: url });

  const [search, setSearch] = useState(
    displaySlug(params.search || '', pairMap, tokensMap),
  );

  useEffect(() => {
    const display = displaySlug(params.search || '', pairMap, tokensMap);
    setSearch(display);
  }, [tokensMap, pairMap, params.search, setSearch]);

  const updateSearchParams = useCallback(
    (search?: string) => {
      navigate({
        to: '.',
        search: (s) => ({ ...s, search: search || undefined }),
        resetScroll: false,
        replace: true,
      });
    },
    [navigate],
  );

  const onSearchHandler = async (value?: string) => {
    if (!value?.length) {
      return updateSearchParams();
    }
    let slug = value;
    const filteredPairs = searchPairTrade(pairMap, namesMap, value);
    if (filteredPairs[0]) {
      const { baseToken, quoteToken } = filteredPairs[0];
      slug = toPairSlug(baseToken, quoteToken);
    }
    const filteredTokens = searchTokens(pairMap, value);
    if (filteredTokens[0]) {
      slug = filteredTokens[0].address.toLowerCase();
    }
    if (value === slug) {
      slug = await getEnsAddressIfAny(provider, value);
    }
    updateSearchParams(slug);
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const value = data.get('search')?.toString();
    onSearchHandler(value);
    setOpen(false);
  };

  const resetHandler = () => {
    setSearch('');
    updateSearchParams();
    setOpen(false);
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
          <SuggestionCombobox
            url={url}
            open={open}
            setOpen={setOpen}
            search={search}
            setSearch={setSearch}
          />
        </div>
        <button type="submit">
          <IconChevron className="size-24" />
        </button>
      </form>
    </div>
  );
};

export const ExplorerSearch = memo(LocalExplorerSearch);
