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
import { useTranslation } from 'libs/translations';
import { SUPPORTED_LANGUAGES } from 'languages/i18n';

export type MenuItemType = {
  subMenu?: MenuType;
  content: string | ReactElement;
  onClick?: Function;
  postClickAction?: MenuItemActions;
};

export type MenuType = 'main' | 'resources' | 'currency' | 'languages';

export type Menu = { title?: string; items: MenuItemType[] };

const iconStyles = 'h-32 w-32 md:h-20 md:w-20';

export const useBurgerMenuItems = () => {
  const { selectedFiatCurrency, setSelectedFiatCurrency, availableCurrencies } =
    useFiatCurrency();
  const { i18n } = useTranslation();
  const menuMap = useMemo(() => new Map<MenuType, Menu>(), []);

  const mainItems = useMemo(
    (): MenuItemType[] => [
      {
        subMenu: 'currency',
        content: <CurrencyMenuItemContent />,
      },
      {
        subMenu: 'languages',
        content: 'Language',
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
              to={externalLinks.twitter}
              className="rounded-6 p-6 md:hover:bg-black"
            >
              <IconTwitter className={iconStyles} />
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

  const languagesItems = useMemo(
    (): MenuItemType[] =>
      SUPPORTED_LANGUAGES.map(({ code, name }) => {
        return {
          content: (
            <Link className="flex" onClick={() => i18n.changeLanguage(code)}>
              {name}
            </Link>
          ),
        };
      }),
    [i18n]
  );

  menuMap.set('main', { items: mainItems });
  menuMap.set('currency', { items: currencyItems, title: 'Currency' });
  menuMap.set('languages', { items: languagesItems, title: 'Language' });
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
