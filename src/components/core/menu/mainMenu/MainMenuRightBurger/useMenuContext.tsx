import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, PathNames } from 'libs/routing';
import { externalLinks } from 'libs/routing/routes';
import { ReactComponent as IconTwitter } from 'assets/logos/twitter.svg';
import { ReactComponent as IconYoutube } from 'assets/logos/youtube.svg';
import { ReactComponent as IconDiscord } from 'assets/logos/discord.svg';
import { ReactComponent as IconTelegram } from 'assets/logos/telegram.svg';
import { ReactComponent as IconV } from 'assets/icons/v.svg';
import { ReactComponent as IconArrow } from 'assets/icons/arrow-cut.svg';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { ImmutableStack } from 'utils/stack';

export type MenuItem = {
  subMenu?: MenuType;
  content: string | ReactElement;
  onClick: () => void;
};

export type MenuType = 'main' | 'resources' | 'currency';

export const useMenuContext = () => {
  const { selectedFiatCurrency, setSelectedFiatCurrency, availableCurrencies } =
    useFiatCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const menuMap = useMemo(
    () => new Map<MenuType, { title?: string; items: MenuItem[] }>(),
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
    (item: MenuItem) => {
      setMenuContext((prev) => {
        if (item?.subMenu) {
          const data = menuMap.get(item?.subMenu);
          if (data?.items) {
            const topSubMenuItem = getTopSubMenuItem(data?.title);
            const newStackItem = {
              title: data.title,
              items: [topSubMenuItem, ...data?.items],
            };
            const updatedStack = prev.push(newStackItem);
            setMenuContext(updatedStack);
          }
        }
        return prev;
      });
    },
    [getTopSubMenuItem, menuMap]
  );

  const back = () => {
    setMenuContext((prev) => prev.pop());
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const mainItems = useMemo(
    (): MenuItem[] => [
      {
        subMenu: 'currency',
        content: <CurrencyMenuItemContent />,
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
        content: (
          <Link className="flex" to={PathNames.terms}>
            Terms of Use
          </Link>
        ),
        onClick: () => {
          closeMenu();
        },
      },
      {
        content: (
          <Link className="flex" to={PathNames.privacy}>
            Privacy Policy
          </Link>
        ),
        onClick: () => {
          closeMenu();
        },
      },
      {
        content: (
          <div className="flex w-full items-center justify-between">
            <Link
              to={externalLinks.twitter}
              className="rounded-6 p-6 md:hover:bg-black"
            >
              <IconTwitter />
            </Link>
            <Link
              to={externalLinks.youtube}
              className="rounded-6 p-6 md:hover:bg-black"
            >
              <IconYoutube />
            </Link>
            <Link
              to={externalLinks.discord}
              className="rounded-6 p-6 md:hover:bg-black"
            >
              <IconDiscord />
            </Link>
            <Link
              to={externalLinks.telegram}
              className="rounded-6 p-6 md:hover:bg-black"
            >
              <IconTelegram />
            </Link>
          </div>
        ),
        onClick: () => setIsOpen(false),
      },
    ],
    [forward]
  );

  const currencyItems = useMemo(
    (): MenuItem[] => [
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
            setMenuContext((prev) => prev.pop());
          },
        };
      }),
    ],
    [availableCurrencies, selectedFiatCurrency, setSelectedFiatCurrency]
  );

  const resourcesItems = useMemo(
    (): MenuItem[] => [
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

  const stack = ImmutableStack.create<
    { items: MenuItem[]; title?: string } | undefined
  >();

  const [menuContext, setMenuContext] = useState(
    stack.push(menuMap.get('main'))
  );

  useEffect(() => {
    if (!isOpen) {
      // Clean up the menu when closing
      setMenuContext((prev) => {
        const updatedStack = prev.clear();
        return updatedStack.push(menuMap.get('main'));
      });
    }
  }, [isOpen, menuMap]);

  return {
    isOpen,
    setIsOpen,
    closeMenu,
    menuContext,
  };
};

const CurrencyMenuItemContent = () => {
  const { selectedFiatCurrency } = useFiatCurrency();
  return (
    <div className="flex w-full items-center justify-between">
      <span>Currency</span>
      <span className="mr-10 font-weight-500">{selectedFiatCurrency}</span>
    </div>
  );
};
