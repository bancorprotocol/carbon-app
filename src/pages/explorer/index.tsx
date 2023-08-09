import { Navigate, useNavigate } from '@tanstack/react-location';
import { Button } from 'components/common/button';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { Page } from 'components/common/page';
import { PairLogoName } from 'components/common/PairLogoName';
import {
  StrategyPageTabs,
  StrategyTab,
} from 'components/strategies/StrategyPageTabs';
import { Link, Outlet, PathNames, useLocation } from 'libs/routing';
import { useExplorer } from 'components/explorer/useExplorer';
import { useEffect, useState } from 'react';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';
import { cn, wait } from 'utils/helpers';

export const ExplorerPage = () => {
  const navigate = useNavigate();
  const {
    current: { pathname },
  } = useLocation();

  const [search, setSearch] = useState('');

  const {
    usePairs: { filteredPairs },
    routeParams: { type, slug },
  } = useExplorer({ search });

  useEffect(() => {
    if (slug) {
      setSearch(slug.toUpperCase().replace('-', '/'));
    }
  }, [slug, setSearch]);

  const tabs: StrategyTab[] = [
    {
      label: 'Overview',
      href: PathNames.explorerOverview(type, slug!),
      hrefMatches: [],
      icon: <IconOverview className={'h-18 w-18'} />,
      // badge: strategies.data?.length || 0,
    },
    {
      label: 'Portfolio',
      href: PathNames.explorerPortfolio(type, slug!),
      hrefMatches: [PathNames.explorerPortfolioToken(type, slug!, '0x')],
      icon: <IconPieChart className={'h-18 w-18'} />,
    },
  ];

  const [showSuggestions, setShowSuggestions] = useState(false);

  if (type !== 'wallet' && type !== 'token-pair') {
    return <Navigate to={PathNames.explorer('wallet')} />;
  }

  return (
    <Page>
      <div className={'space-y-20'}>
        <div className={cn('flex space-x-20')}>
          <div
            className={cn(
              'flex w-full items-center space-x-16 rounded-full border border-green px-16'
            )}
          >
            <div className={'shrink-0'}>
              <DropdownMenu
                button={(onClick) => <button onClick={onClick}>{type}</button>}
              >
                <div>
                  <Link to="/explorer/wallet" onClick={() => setSearch('')}>
                    Wallet
                  </Link>
                </div>
                <div>
                  <Link to="/explorer/token-pair" onClick={() => setSearch('')}>
                    Token Pair
                  </Link>
                </div>
              </DropdownMenu>
            </div>
            <div className={'relative w-full flex-grow'}>
              <input
                type="text"
                value={search}
                className={cn('w-full flex-grow bg-black')}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={async () => {
                  await wait(200);
                  setShowSuggestions(false);
                }}
              />
              {type === 'token-pair' &&
                filteredPairs.length > 0 &&
                showSuggestions && (
                  <div
                    className={
                      'absolute z-30 mt-20 w-full overflow-hidden rounded-10 bg-emphasis'
                    }
                  >
                    {filteredPairs.map((pair) => {
                      const slug =
                        `${pair.baseToken.symbol}-${pair.quoteToken.symbol}`.toLowerCase();

                      return (
                        <Link
                          to={PathNames.explorerOverview('token-pair', slug)}
                          key={slug}
                          className={cn('flex px-10 py-5 hover:bg-white/10')}
                          onClick={() => {
                            setShowSuggestions(false);
                          }}
                        >
                          <PairLogoName pair={pair} />
                        </Link>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
          <Button
            variant={'success'}
            size={'sm'}
            className={'shrink-0'}
            onClick={() => {
              const slug = search.replace('/', '-').toLowerCase();
              navigate({
                to: PathNames.explorerOverview(type, slug),
              });
            }}
          >
            Search
          </Button>
        </div>

        {slug && <StrategyPageTabs currentPathname={pathname} tabs={tabs} />}
        <Outlet />
      </div>
    </Page>
  );
};
