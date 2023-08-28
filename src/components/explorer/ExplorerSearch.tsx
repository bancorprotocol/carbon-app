import { Button } from 'components/common/button';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { ExplorerSearchDropdownButton } from 'components/explorer/ExplorerSearchDropdownButton';
import { ExplorerSearchDropdownItems } from 'components/explorer/ExplorerSearchDropdownItems';
import { ExplorerSearchInput } from 'components/explorer/ExplorerSearchInput';
import ExplorerSearchSuggestions from 'components/explorer/ExplorerSearchSuggestions';
import { ExplorerRouteGenerics } from 'components/explorer/utils';
import { utils } from 'ethers';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { PathNames, useNavigate } from 'libs/routing';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
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
  const [_showSuggestions, setShowSuggestions] = useState(false);

  const isInvalidAddress = useMemo(() => {
    return (
      props.search.length > 0 &&
      props.type === 'wallet' &&
      !utils.isAddress(props.search.toLowerCase())
    );
  }, [props.search, props.type]);

  const onSearchHandler = useCallback(
    (v?: string) => {
      if (isInvalidAddress) {
        return;
      }
      if (props.search.length === 0) {
        return;
      }
      if (props.type === 'token-pair' && props.filteredPairs.length === 0) {
        return;
      }
      const value = v || props.search;
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

  const showSuggestions = props.type === 'token-pair' && _showSuggestions;

  return (
    <div className={'relative'}>
      <div className={cn('flex space-x-4 md:space-x-20')}>
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
          <div className={'h-20 w-1 bg-white/40'}></div>
          <div className={'w-full flex-grow md:relative'}>
            <ExplorerSearchInput
              {...props}
              setShowSuggestions={setShowSuggestions}
              onSearchHandler={onSearchHandler}
              isError={isInvalidAddress}
            />

            {showSuggestions && (
              <ExplorerSearchSuggestions
                filteredPairs={props.filteredPairs}
                setShowSuggestions={setShowSuggestions}
                setSearch={props.setSearch}
              />
            )}
          </div>
        </div>

        <Button
          variant={'success'}
          size={'md'}
          className={'w-40 shrink-0 !px-0 md:w-[180px]'}
          onClick={() => onSearchHandler()}
        >
          <IconSearch className={'h-16 w-16 md:mr-8'} />
          <span className={'hidden md:block'}>Search</span>
        </Button>
      </div>
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
