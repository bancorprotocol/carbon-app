import { ReactElement, useMemo } from 'react';
import { externalLinks, A, Link } from 'libs/routing';
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
        <A className="flex" to={externalLinks.faq}>
          FAQ
        </A>
      ),
    },
    {
      content: (
        <A className="flex" to={externalLinks.analytics}>
          Analytics
        </A>
      ),
    },
    {
      content: (
        <A className="flex" to={externalLinks.blog}>
          Blog
        </A>
      ),
    },
    {
      content: (
        <Link className="flex" to={'/terms'}>
          Terms of Use
        </Link>
      ),
    },
    {
      content: (
        <Link className="flex" to={'/privacy'}>
          Privacy Policy
        </Link>
      ),
    },
    {
      content: (
        <div className="flex w-full items-center justify-between">
          <A to={externalLinks.x} className="rounded-6 p-6 md:hover:bg-black">
            <IconX className={iconStyles} />
          </A>
          <A
            to={externalLinks.youtube}
            className="rounded-6 p-6 md:hover:bg-black"
          >
            <IconYoutube className={iconStyles} />
          </A>
          <A
            to={externalLinks.discord}
            className="rounded-6 p-6 md:hover:bg-black"
          >
            <IconDiscord className={iconStyles} />
          </A>
          <A
            to={externalLinks.telegram}
            className="rounded-6 p-6 md:hover:bg-black"
          >
            <IconTelegram className={iconStyles} />
          </A>
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
        <A className="flex" to={externalLinks.techDocs}>
          Tech Docs
        </A>
      ),
    },
    {
      content: (
        <A className="flex" to={externalLinks.litePaper}>
          Litepaper
        </A>
      ),
    },
    {
      content: (
        <A className="flex" to={externalLinks.whitepaper}>
          Whitepaper
        </A>
      ),
    },
    {
      content: (
        <A className="flex" to={externalLinks.simulatorRepo}>
          Simulator Repo
        </A>
      ),
    },
    {
      content: (
        <A className="flex" to={externalLinks.interactiveSim}>
          Interactive Simulator
        </A>
      ),
    },
    {
      content: (
        <A className="flex" to={externalLinks.duneDashboard}>
          Dune Dashboard
        </A>
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
