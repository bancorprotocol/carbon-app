import { ReactElement, useMemo } from 'react';
import { Link, PathNames } from 'libs/routing';
import { externalLinks } from 'libs/routing/routes';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { MenuItemActions } from './useMenuContext';
import { ReactComponent as IconX } from 'assets/logos/x.svg';
import { ReactComponent as IconYoutube } from 'assets/logos/youtube.svg';
import { ReactComponent as IconDiscord } from 'assets/logos/discord.svg';
import { ReactComponent as IconTelegram } from 'assets/logos/telegram.svg';
import { ReactComponent as IconV } from 'assets/icons/v.svg';

export type MenuItemType = {
  subMenu?: MenuType;
  content: string | ReactElement;
  onClick?: Function;
  postClickAction?: MenuItemActions;
};

export type MenuType = 'main' | 'resources' | 'currency';

export type Menu = { title?: string; items: MenuItemType[] };

const iconStyles = 'h-32 w-32 md:h-20 md:w-20';

export const useBurgerMenuItems = () => {
  const { selectedFiatCurrency, setSelectedFiatCurrency, availableCurrencies } =
    useFiatCurrency();
  const menuMap = new Map<MenuType, Menu>();

  const mainItems: MenuItemType[] = [
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
        <Link className="flex" to={externalLinks.faq}>
          FAQ
        </Link>
      ),
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
            to={externalLinks.x}
            className="rounded-6 p-6 md:hover:bg-black"
          >
            <IconX className={iconStyles} />
          </Link>
          <Link
            to={externalLinks.youtube}
            className="rounded-6 p-6 md:hover:bg-black"
          >
            <IconYoutube className={iconStyles} />
          </Link>
          <Link
            to={externalLinks.discord}
            className="rounded-6 p-6 md:hover:bg-black"
          >
            <IconDiscord className={iconStyles} />
          </Link>
          <Link
            to={externalLinks.telegram}
            className="rounded-6 p-6 md:hover:bg-black"
          >
            <IconTelegram className={iconStyles} />
          </Link>
        </div>
      ),
    },
  ];

  const currencyItems = useMemo(
    (): MenuItemType[] => [
      ...availableCurrencies.map((currency) => {
        const isCurrencySelected = currency === selectedFiatCurrency;

        return {
          content: (
            <div
              className={`flex justify-between gap-20 ${
                isCurrencySelected ? '' : ''
              }`}
            >
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
          postClickAction: 'back' as const,
        };
      }),
    ],
    [availableCurrencies, selectedFiatCurrency, setSelectedFiatCurrency]
  );

  const resourcesItems: MenuItemType[] = [
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
        <Link className="flex" to={externalLinks.interactiveSim}>
          Interactive Simulator
        </Link>
      ),
    },
    {
      content: (
        <Link className="flex" to={externalLinks.duneDashboard}>
          Dune Dashboard
        </Link>
      ),
    },
  ];

  menuMap.set('main', { items: mainItems });
  menuMap.set('currency', {
    items: currencyItems,
    title: 'Currency',
  });
  menuMap.set('resources', {
    items: resourcesItems,
    title: 'Resources',
  });

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
