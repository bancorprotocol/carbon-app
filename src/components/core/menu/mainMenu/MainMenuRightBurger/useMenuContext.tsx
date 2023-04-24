import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, PathNames, useNavigate } from 'libs/routing';
import { MyLocationGenerics } from 'components/trade/useTradeTokens';
import { externalLinks } from 'libs/routing/routes';
import { ReactComponent as IconTwitter } from 'assets/logos/twitter.svg';
import { ReactComponent as IconYoutube } from 'assets/logos/youtube.svg';
import { ReactComponent as IconDiscord } from 'assets/logos/discord.svg';
import { ReactComponent as IconTelegram } from 'assets/logos/telegram.svg';
import { ReactComponent as IconV } from 'assets/icons/v.svg';
import { ReactComponent as IconArrow } from 'assets/icons/arrow-cut.svg';
import { useFiatCurrency } from 'hooks/useFiatCurrency';

export type Item = {
  subMenu?: MenuType;
  content: string | ReactElement;
  onClick: () => void;
};

export type MenuType = 'main' | 'resources' | 'currency';

export const useMenuContext = () => {
  const navigate = useNavigate<MyLocationGenerics>();
  const { selectedFiatCurrency, setSelectedFiatCurrency, availableCurrencies } =
    useFiatCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const menuMap = useMemo(
    () => new Map<MenuType, { title?: string; items: Item[] }>(),
    []
  );

  const getTopSubMenuItem = useCallback((title?: string) => {
    return {
      content: (
        <div className="flex items-center gap-10">
          <IconArrow className="h-12 w-7 rotate-180" />
          <span className="font-weight-500">{title}</span>
        </div>
      ),
      onClick: () => {
        back();
      },
    };
  }, []);

  const forward = useCallback(
    (item: Item) => {
      setMenuContext((prev) => {
        if (item?.subMenu) {
          const data = menuMap.get(item?.subMenu);
          if (data?.items) {
            const topSubMenuItem = getTopSubMenuItem(data?.title);
            const newContext = {
              title: data.title,
              items: [topSubMenuItem, ...data?.items],
            };
            setMenuContext([...prev, newContext]);
          }
        }
        return prev;
      });
    },
    [getTopSubMenuItem, menuMap]
  );

  const back = () => {
    setMenuContext((prev) => {
      const updatedContext = [...prev];
      updatedContext.pop();
      return updatedContext;
    });
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const mainItems = useMemo(
    (): Item[] => [
      {
        subMenu: 'currency',
        content: (
          <div className="flex w-full items-center justify-between">
            <span>Currency</span>
            <span className="mr-10 font-weight-500">
              {selectedFiatCurrency}
            </span>
          </div>
        ),
        onClick: function () {
          forward(this);
        },
      },
      {
        subMenu: 'resources',
        content: 'Resources',
        onClick: function () {
          forward(this);
        },
      },
      {
        content: (
          <Link className="flex" to={externalLinks.analytics}>
            Analytics
          </Link>
        ),
        onClick: () => {
          closeMenu();
        },
      },
      {
        content: (
          <Link className="flex" to={externalLinks.blog}>
            Blog
          </Link>
        ),
        onClick: () => {
          closeMenu();
        },
      },
      {
        content: 'Terms of Use',
        onClick: () => {
          navigate({ to: PathNames.terms });
          closeMenu();
        },
      },
      {
        content: 'Privacy Policy',
        onClick: () => {
          navigate({ to: PathNames.privacy });
          closeMenu();
        },
      },
      {
        content: (
          <div className="flex w-full items-center justify-between">
            <Link
              to={externalLinks.twitter}
              className="rounded-6 p-6 hover:bg-black"
            >
              <IconTwitter />
            </Link>
            <Link
              to={externalLinks.youtube}
              className="rounded-6 p-6 hover:bg-black"
            >
              <IconYoutube />
            </Link>
            <Link
              to={externalLinks.discord}
              className="rounded-6 p-6 hover:bg-black"
            >
              <IconDiscord />
            </Link>
            <Link
              to={externalLinks.telegram}
              className="rounded-6 p-6 hover:bg-black"
            >
              <IconTelegram />
            </Link>
          </div>
        ),
        onClick: () => setIsOpen(false),
      },
    ],
    [navigate, selectedFiatCurrency, forward]
  );

  const currencyItems = useMemo(
    (): Item[] => [
      ...availableCurrencies.map((currency) => {
        const isCurrencySelected = currency === selectedFiatCurrency;

        return {
          content: (
            <div className={`flex gap-20 ${isCurrencySelected ? '' : ''}`}>
              <span>{currency}</span>
              <span className="flex items-center">
                <IconV
                  className={`invisible h-12 w-12 ${
                    isCurrencySelected ? '!visible' : ''
                  }`}
                />
              </span>
            </div>
          ),
          onClick: () => {
            setSelectedFiatCurrency(currency);
            closeMenu();
          },
        };
      }),
    ],
    [availableCurrencies, selectedFiatCurrency, setSelectedFiatCurrency]
  );

  const resourcesItems = useMemo(
    (): Item[] => [
      {
        content: (
          <Link className="flex" to={externalLinks.techDocs}>
            Tech Docs
          </Link>
        ),
        onClick: () => {
          closeMenu();
        },
      },
      {
        content: (
          <Link className="flex" to={externalLinks.litePaper}>
            Litepaper
          </Link>
        ),
        onClick: () => {
          closeMenu();
        },
      },
      {
        content: (
          <Link className="flex" to={externalLinks.whitepaper}>
            Whitepaper
          </Link>
        ),
        onClick: () => {
          closeMenu();
        },
      },
      {
        content: (
          <Link className="flex" to={externalLinks.simulatorRepo}>
            Simulator Repo
          </Link>
        ),
        onClick: () => {
          closeMenu();
        },
      },
      {
        content: (
          <Link to={externalLinks.interactiveSim}>Interactive Simulator</Link>
        ),
        onClick: () => {
          closeMenu();
        },
      },
    ],
    []
  );

  menuMap.set('main', { items: mainItems });

  menuMap.set('currency', { items: currencyItems, title: 'Currency' });

  menuMap.set('resources', { items: resourcesItems, title: 'Resources' });

  const [menuContext, setMenuContext] = useState([menuMap.get('main')]);

  useEffect(() => {
    if (!isOpen) {
      // Clean up the menu when closing
      setMenuContext([menuMap.get('main')]);
    }
  }, [isOpen, menuMap]);

  return {
    isOpen,
    setIsOpen,
    closeMenu,
    menuContext,
  };
};
