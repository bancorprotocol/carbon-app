import { Button } from 'components/common/button';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { ExplorerSearchDropdownButton } from 'components/explorer/ExplorerSearchDropdownButton';
import { ExplorerSearchDropdownItems } from 'components/explorer/ExplorerSearchDropdownItems';
import { ExplorerSearchInput } from 'components/explorer/ExplorerSearchInput';
import ExplorerSearchSuggestions from 'components/explorer/suggestion';
import { ExplorerRouteGenerics } from 'components/explorer/utils';
import { utils } from 'ethers';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { PathNames, useNavigate } from 'libs/routing';
import {
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useCallback,
  useMemo,
} from 'react';
import { config } from 'services/web3/config';
import { cn } from 'utils/helpers';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

export interface ExplorerSearchProps {
  type: ExplorerRouteGenerics['Params']['type'];
  filteredPairs: TradePair[];
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

export const ExplorerSearch: FC<ExplorerSearchProps> = (props) => {
  const navigate = useNavigate();

  const isInvalidAddress = useMemo(() => {
    return (
      (props.search.length > 0 &&
        props.type === 'wallet' &&
        !utils.isAddress(props.search.toLowerCase())) ||
      props.search === config.tokens.ZERO
    );
  }, [props.search, props.type]);

  const onSearchHandler = useCallback(
    (v?: string) => {
      const value = v || props.search;
      if (isInvalidAddress) {
        return;
      }
      if (value.length === 0) {
        return;
      }
      if (props.type === 'token-pair' && props.filteredPairs.length === 0) {
        return;
      }
      const slug = value.replace('/', '-').replace(' ', '-').toLowerCase();
      navigate({
        to: PathNames.explorerOverview(props.type, slug),
      });
    },
    [
      isInvalidAddress,
      navigate,
      props.filteredPairs.length,
      props.search,
      props.type,
    ]
  );

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.type === 'wallet' && isInvalidAddress) return;
    const data = new FormData(e.target as HTMLFormElement);
    const value = data.get('search')?.toString();
    onSearchHandler(value);
  };

  const resetHandler = (e: FormEvent<HTMLFormElement>) => {
    props.setSearch('');
    const selector = 'input[name="search"]';
    const input = (e.target as Element).querySelector<HTMLElement>(selector);
    input?.focus();
  };

  const suggestionProps = {
    filteredPairs: props.filteredPairs,
    search: props.search,
    setSearch: props.setSearch,
  };

  return (
    <div className={'relative'}>
      <form
        role="search"
        onSubmit={submitHandler}
        onReset={resetHandler}
        className={cn('flex space-x-4 md:space-x-20')}
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
          <div className={'shrink-0'}>
            <DropdownMenu
              placement={'bottom-start'}
              button={(onClick) => (
                <ExplorerSearchDropdownButton
                  onClick={onClick}
                  type={props.type}
                />
              )}
              className={'mt-10 -ml-17 !px-10 !py-10'}
            >
              <ExplorerSearchDropdownItems
                setSearch={props.setSearch}
                type={props.type}
              />
            </DropdownMenu>
          </div>
          <div role="separator" className={'h-20 w-1 bg-white/40'}></div>
          <div className={'flex w-full flex-grow items-center md:relative'}>
            {props.type === 'token-pair' && (
              <ExplorerSearchSuggestions {...suggestionProps} />
            )}
            {props.type === 'wallet' && <ExplorerSearchInput {...props} />}
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
