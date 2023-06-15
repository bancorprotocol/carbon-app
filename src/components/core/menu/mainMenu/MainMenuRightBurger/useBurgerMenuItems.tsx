import { ReactElement, useMemo } from 'react';
import { Link, PathNames } from 'libs/routing';
import { externalLinks } from 'libs/routing/routes';
import { useTranslation } from 'libs/translations';
import { SUPPORTED_LANGUAGES } from 'libs/translations/i18n';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { MenuItemActions } from './useMenuContext';
import { ReactComponent as IconTwitter } from 'assets/logos/twitter.svg';
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

export type MenuType = 'main' | 'resources' | 'currency' | 'languages';

export type Menu = { title?: string; items: MenuItemType[] };

const iconStyles = 'h-32 w-32 md:h-20 md:w-20';

export const useBurgerMenuItems = () => {
  const { selectedFiatCurrency, setSelectedFiatCurrency, availableCurrencies } =
    useFiatCurrency();
  const { t, i18n } = useTranslation();
  const menuMap = new Map<MenuType, Menu>();
  const currentLangName = SUPPORTED_LANGUAGES.find(
    ({ code }) => code === i18n.language
  )?.name;

  const mainItems: MenuItemType[] = [
    {
      subMenu: 'currency',
      content: <CurrencyMenuItemContent />,
    },
    {
      subMenu: 'languages',
      content: (
        <div className="flex w-full items-center justify-between">
          <span>{t('navBar.burgerMenu.items.item2')}</span>
          <span className="font-weight-500 me-10">{currentLangName}</span>
        </div>
      ),
    },
    {
      subMenu: 'resources',
      content: t('navBar.burgerMenu.items.item3'),
    },
    {
      content: (
        <Link className="flex" to={externalLinks.faq}>
          {t('navBar.burgerMenu.items.item4')}
        </Link>
      ),
    },
    {
      content: (
        <Link className="flex" to={externalLinks.analytics}>
          {t('navBar.burgerMenu.items.item5')}
        </Link>
      ),
    },
    {
      content: (
        <Link className="flex" to={externalLinks.blog}>
          {t('navBar.burgerMenu.items.item6')}
        </Link>
      ),
    },
    {
      content: (
        <Link className="flex" to={PathNames.terms}>
          {t('navBar.burgerMenu.items.item7')}
        </Link>
      ),
    },
    {
      content: (
        <Link className="flex" to={PathNames.privacy}>
          {t('navBar.burgerMenu.items.item8')}
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
  ];

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
    [
      availableCurrencies,
      selectedFiatCurrency,
      setSelectedFiatCurrency,
      i18n.language,
    ]
  );

  const resourcesItems: MenuItemType[] = [
    {
      content: (
        <Link className="flex" to={externalLinks.techDocs}>
          {t('navBar.burgerMenu.items.item9')}
        </Link>
      ),
    },
    {
      content: (
        <Link className="flex" to={externalLinks.litePaper}>
          {t('navBar.burgerMenu.items.item10')}
        </Link>
      ),
    },
    {
      content: (
        <Link className="flex" to={externalLinks.whitepaper}>
          {t('navBar.burgerMenu.items.item11')}
        </Link>
      ),
    },
    {
      content: (
        <Link className="flex" to={externalLinks.simulatorRepo}>
          {t('navBar.burgerMenu.items.item12')}
        </Link>
      ),
    },
    {
      content: (
        <Link to={externalLinks.interactiveSim}>
          {t('navBar.burgerMenu.items.item13')}
        </Link>
      ),
    },
  ];

  const languagesItems: MenuItemType[] = SUPPORTED_LANGUAGES.map(
    ({ code, name }) => {
      return {
        content: (
          <div
            className="flex gap-20"
            onClick={() => i18n.changeLanguage(code)}
          >
            <span>{name}</span>
            <span className="flex items-center">
              <IconV
                className={`invisible h-12 w-12 ${
                  i18n.language.includes(code) ? '!visible' : ''
                }`}
              />
            </span>
          </div>
        ),
      };
    }
  );

  menuMap.set('main', { items: mainItems });
  menuMap.set('currency', {
    items: currencyItems,
    title: t('navBar.burgerMenu.items.item1'),
  });
  menuMap.set('languages', {
    items: languagesItems,
    title: t('navBar.burgerMenu.items.item2'),
  });
  menuMap.set('resources', {
    items: resourcesItems,
    title: t('navBar.burgerMenu.items.item3'),
  });

  return {
    menuMapping: menuMap,
  };
};

const CurrencyMenuItemContent = () => {
  const { t } = useTranslation();
  const { selectedFiatCurrency } = useFiatCurrency();
  return (
    <div className="flex w-full items-center justify-between">
      <span>{t('navBar.burgerMenu.items.item1')}</span>
      <span className="font-weight-500 me-10">{selectedFiatCurrency}</span>
    </div>
  );
};
