import { ReactElement, useMemo } from 'react';
import { Link, PathNames } from 'libs/routing';
import { externalLinks } from 'libs/routing/routes';
import { ReactComponent as IconTwitter } from 'assets/logos/twitter.svg';
import { ReactComponent as IconYoutube } from 'assets/logos/youtube.svg';
import { ReactComponent as IconDiscord } from 'assets/logos/discord.svg';
import { ReactComponent as IconTelegram } from 'assets/logos/telegram.svg';
import { ReactComponent as IconV } from 'assets/icons/v.svg';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { MenuItemActions } from './useMenuContext';

export type MenuItemType = {
  subMenu?: MenuType;
  content: string | ReactElement;
  onClick?: Function;
  postClickAction?: MenuItemActions;
};

export type MenuType = 'main' | 'resources' | 'currency';

export const useBurgerMenuItems = () => {
  const { selectedFiatCurrency, setSelectedFiatCurrency, availableCurrencies } =
    useFiatCurrency();

  const menuMap = useMemo(
    () => new Map<MenuType, { title?: string; items: MenuItemType[] }>(),
    []
  );

  const mainItems = useMemo(
    (): MenuItemType[] => [
      {
        subMenu: 'currency',
        content: <CurrencyMenuItemContent />,
      },
      {
        subMenu: 'resources',
        content: 'Resources',
      },
      {
        content: (
          <Link className="flex" to={externalLinks.analytics}>
            Analytics
          </Link>
        ),
      },
      {
        content: (
          <Link className="flex" to={externalLinks.blog}>
            Blog
          </Link>
        ),
      },
      {
        content: (
          <Link className="flex" to={PathNames.terms}>
            Terms of Use
          </Link>
        ),
      },
      {
        content: (
          <Link className="flex" to={PathNames.privacy}>
            Privacy Policy
          </Link>
        ),
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
      },
    ],
    []
  );

  const currencyItems = useMemo(
    (): MenuItemType[] => [
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
          },
          postClickAction: MenuItemActions.Back,
        };
      }),
    ],
    [availableCurrencies, selectedFiatCurrency, setSelectedFiatCurrency]
  );

  const resourcesItems = useMemo(
    (): MenuItemType[] => [
      {
        content: (
          <Link className="flex" to={externalLinks.techDocs}>
            Tech Docs
          </Link>
        ),
      },
      {
        content: (
          <Link className="flex" to={externalLinks.litePaper}>
            Litepaper
          </Link>
        ),
      },
      {
        content: (
          <Link className="flex" to={externalLinks.whitepaper}>
            Whitepaper
          </Link>
        ),
      },
      {
        content: (
          <Link className="flex" to={externalLinks.simulatorRepo}>
            Simulator Repo
          </Link>
        ),
      },
      {
        content: (
          <Link to={externalLinks.interactiveSim}>Interactive Simulator</Link>
        ),
      },
    ],
    []
  );

  menuMap.set('main', { items: mainItems });

  menuMap.set('currency', { items: currencyItems, title: 'Currency' });

  menuMap.set('resources', { items: resourcesItems, title: 'Resources' });

  return {
    menuMapping: menuMap,
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
