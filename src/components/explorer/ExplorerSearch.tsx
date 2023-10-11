import {
  FC,
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Button } from 'components/common/button';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { ExplorerSearchDropdownButton } from 'components/explorer/ExplorerSearchDropdownButton';
import { ExplorerSearchDropdownItems } from 'components/explorer/ExplorerSearchDropdownItems';
import { ExplorerSearchInput } from 'components/explorer/ExplorerSearchInput';
import ExplorerSearchSuggestions from 'components/explorer/suggestion';
import { utils } from 'ethers';
import { PathNames, useNavigate } from 'libs/routing';
import { config } from 'services/web3/config';
import { cn } from 'utils/helpers';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { fromPairSlug } from 'utils/pairSearch';
import { useExplorerParams } from './useExplorerParams';
import { usePairs } from 'hooks/usePairs';
import { useGetAddressFromEns } from 'libs/queries';
import { useDebouncedValue } from 'hooks/useDebouncedValue';

export const _ExplorerSearch: FC = () => {
  const navigate = useNavigate();
  const pairs = usePairs();
  const { type, slug } = useExplorerParams();
  const [search, setSearch] = useState(slug ?? '');
  const [debouncedSearch] = useDebouncedValue<string>(search, 300); // Debounce search input for ens query

  const ensAddressQuery = useGetAddressFromEns(debouncedSearch.toLowerCase());

  const isInvalidEnsAddress = !ensAddressQuery.data;

  const waitingToFetchEns =
    debouncedSearch !== search || !ensAddressQuery.isSuccess;

  const isInvalidAddress = useMemo(() => {
    if (type !== 'wallet' || !search.length) return false;
    if (search === config.tokens.ZERO) return true;

    return (
      !utils.isAddress(search.toLowerCase()) &&
      isInvalidEnsAddress &&
      !waitingToFetchEns
    );
  }, [type, search, isInvalidEnsAddress, waitingToFetchEns]);

  useEffect(() => {
    if (!slug) return setSearch('');
    if (type === 'wallet') return setSearch(slug);
    if (type === 'token-pair') {
      const content = pairs.names.has(slug)
        ? pairs.names.get(slug)
        : pairs.names.get(fromPairSlug(slug));
      return setSearch(content || slug);
    }
  }, [slug, type, pairs.names]);

  const onSearchHandler = useCallback(
    (value: string) => {
      if (value.length === 0) return;
      const slug = fromPairSlug(value);
      if (type === 'token-pair' && !pairs.names.has(slug)) return;
      if (type === 'wallet' && (waitingToFetchEns || isInvalidAddress)) return;
      navigate({
        to: PathNames.explorerOverview(type, slug),
      });
    },
    [waitingToFetchEns, isInvalidAddress, navigate, pairs.names, type]
  );

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const value = data.get('search')?.toString();
    if (value) onSearchHandler(value);
  };

  const resetHandler = (e: FormEvent<HTMLFormElement>) => {
    setSearch('');
    const selector = 'input[name="search"]';
    const input = (e.target as Element).querySelector<HTMLElement>(selector);
    input?.focus();
  };

  const inputProps = {
    invalid: isInvalidAddress,
    search,
    setSearch,
  };

  const suggestionProps = {
    pairMap: pairs.map,
    nameMap: pairs.names,
    search,
    setSearch,
  };

  return (
    <div className={'relative'}>
      <form
        role="search"
        onSubmit={submitHandler}
        onReset={resetHandler}
        className="flex gap-16"
      >
        <div
          className={cn(
            'relative',
            'flex',
            'h-40',
            'w-full',
            'items-center',
            'space-x-8',
            'rounded-full',
            'border',
            'border-green',
            'px-16',
            'md:space-x-16',
            isInvalidAddress && 'border-red'
          )}
        >
          <div className="shrink-0">
            <DropdownMenu
              placement="bottom-start"
              className="mt-10 -ml-17 p-10"
              button={(attr) => <ExplorerSearchDropdownButton {...attr} />}
            >
              <ExplorerSearchDropdownItems setSearch={setSearch} />
            </DropdownMenu>
          </div>
          <div role="separator" className="h-20 w-1 bg-white/40"></div>
          <div className="flex w-full flex-grow items-center md:relative">
            {type === 'token-pair' && (
              <ExplorerSearchSuggestions {...suggestionProps} />
            )}
            {type === 'wallet' && <ExplorerSearchInput {...inputProps} />}
          </div>
        </div>

        <Button
          type="submit"
          variant={'success'}
          size={'md'}
          className={'w-40 shrink-0 !px-0 md:w-[180px]'}
        >
          <IconSearch className={'h-16 w-16 md:mr-8'} />
          <span className={'hidden md:block'}>Search</span>
        </Button>
      </form>
      {isInvalidAddress && (
        <div
          className={
            'absolute mt-4 flex items-center font-mono text-14 text-red'
          }
        >
          <IconWarning className={'mr-10 h-16 w-16'} />
          Invalid Wallet Address
        </div>
      )}
    </div>
  );
};

export const ExplorerSearch = memo(_ExplorerSearch);
