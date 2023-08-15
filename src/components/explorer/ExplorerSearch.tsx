import { useNavigate } from '@tanstack/react-location';
import { Button } from 'components/common/button';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { ExplorerSearchDropdownButton } from 'components/explorer/ExplorerSearchDropdownButton';
import { ExplorerSearchDropdownItems } from 'components/explorer/ExplorerSearchDropdownItems';
import { ExplorerSearchInput } from 'components/explorer/ExplorerSearchInput';
import { ExplorerSearchSuggestions } from 'components/explorer/ExplorerSearchSuggestions';
import { ExplorerRouteGenerics } from 'components/explorer/utils';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { PathNames } from 'libs/routing';
import { Dispatch, FC, SetStateAction, useCallback, useState } from 'react';
import { cn } from 'utils/helpers';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';

export interface ExplorerSearchProps {
  type: ExplorerRouteGenerics['Params']['type'];
  filteredPairs: TradePair[];
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

export const ExplorerSearch: FC<ExplorerSearchProps> = (props) => {
  const navigate = useNavigate();
  const [_showSuggestions, setShowSuggestions] = useState(false);

  const onSearchHandler = useCallback(() => {
    const slug = props.search.replace('/', '-').toLowerCase();
    navigate({
      to: PathNames.explorerOverview(props.type, slug),
    });
  }, [navigate, props.search, props.type]);

  const showSuggestions =
    props.type === 'token-pair' &&
    props.filteredPairs.length > 0 &&
    _showSuggestions;

  return (
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
          'md:space-x-16'
        )}
      >
        <div className={'shrink-0'}>
          <DropdownMenu
            button={(onClick) => (
              <ExplorerSearchDropdownButton onClick={onClick} {...props} />
            )}
          >
            <ExplorerSearchDropdownItems {...props} />
          </DropdownMenu>
        </div>
        <div className={'h-20 w-1 bg-white/40'}></div>
        <div className={'w-full flex-grow md:relative'}>
          <ExplorerSearchInput
            {...props}
            setShowSuggestions={setShowSuggestions}
          />

          {showSuggestions && (
            <ExplorerSearchSuggestions
              {...props}
              setShowSuggestions={setShowSuggestions}
            />
          )}
        </div>
      </div>

      <Button
        variant={'success'}
        size={'md'}
        className={'w-40 shrink-0 px-0 md:w-[180px]'}
        onClick={onSearchHandler}
      >
        <IconSearch className={'h-16 w-16 md:hidden'} />
        <span className={'hidden md:block'}>Search</span>
      </Button>
    </div>
  );
};
