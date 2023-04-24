import { ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, PathNames, useNavigate } from 'libs/routing';
import { MyLocationGenerics } from 'components/trade/useTradeTokens';
import { externalLinks } from 'libs/routing/routes';
import { ReactComponent as IconTwitter } from 'assets/logos/twitter.svg';
import { ReactComponent as IconYoutube } from 'assets/logos/youtube.svg';
import { ReactComponent as IconDiscord } from 'assets/logos/discord.svg';
import { ReactComponent as IconTelegram } from 'assets/logos/telegram.svg';
import { ReactComponent as IconV } from 'assets/icons/v.svg';
import { ReactComponent as IconArrow } from 'assets/icons/arrow-cut.svg';
import { openUrlInNewTab } from '../../utils';
import { useFiatCurrency } from 'hooks/useFiatCurrency';

export type Item = {
  id: string;
  content: string | ReactElement;
  onClick: () => void;
};

type MenuType = 'main' | 'resources' | 'currency';

export const useMenuContext = () => {
  const navigate = useNavigate<MyLocationGenerics>();
  const { selectedFiatCurrency, setSelectedFiatCurrency, availableCurrencies } =
    useFiatCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [menuType, setMenuType] = useState<{ type: MenuType; title?: string }>({
    type: 'main',
  });

  const items: Item[] = useMemo(() => {
    return [
      {
        id: 'currency',
        content: (
          <div className="flex w-full items-center justify-between">
            <span>Currency</span>
            <span className="mr-10 font-weight-500">
              {selectedFiatCurrency}
            </span>
          </div>
        ),
        onClick: () => {
          setMenuType({ type: 'currency', title: 'Currency' });
        },
      },
      {
        id: 'resources',
        content: 'Resources',
        onClick: () => {
          setMenuType({ type: 'resources', title: 'Resources' });
        },
      },
      {
        id: 'analytics',
        content: 'Analytics',
        onClick: () => {
          openUrlInNewTab(externalLinks.analytics);
          closeMenu();
        },
      },
      {
        id: 'blog',
        content: 'Blog',
        onClick: () => {
          openUrlInNewTab(externalLinks.blog);
          closeMenu();
        },
      },
      {
        id: 'termOfUse',
        content: 'Terms of Use',
        onClick: () => {
          navigate({ to: PathNames.terms });
          closeMenu();
        },
      },
      {
        id: 'privacyPolicy',
        content: 'Privacy Policy',
        onClick: () => {
          navigate({ to: PathNames.privacy });
          closeMenu();
        },
      },
      {
        id: 'social',
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
    ];
  }, [navigate, selectedFiatCurrency]);

  const [menuContext, setMenuContext] = useState([items]);

  const menuMap = useMemo(() => new Map(), []);

  menuMap.set('currency', [
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
  ]);

  menuMap.set('resources', [
    {
      content: 'Tech Docs',
      onClick: () => {
        openUrlInNewTab(externalLinks.techDocs);
        closeMenu();
      },
    },
    {
      content: 'Litepaper',
      onClick: () => {
        openUrlInNewTab(externalLinks.litePaper);
        closeMenu();
      },
    },
    {
      content: 'Whitepaper',
      onClick: () => {
        openUrlInNewTab(externalLinks.whitepaper);
        closeMenu();
      },
    },
    {
      content: 'Simulator Repo',
      onClick: () => {
        openUrlInNewTab(externalLinks.simulatorRepo);
        closeMenu();
      },
    },
    {
      content: 'Interactive Simulator',
      onClick: () => {
        openUrlInNewTab(externalLinks.interactiveSim);
        closeMenu();
      },
    },
  ]);

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setMenuType({ type: 'main' });
    }
  }, [isOpen, items]);

  useEffect(() => {
    if (menuType.type !== 'main') {
      const subMenu = menuMap.get(menuType.type);
      const titleItem = {
        content: (
          <div className="flex items-center gap-10">
            <IconArrow className="h-12 w-7 rotate-180" />
            <span className="font-weight-500">{menuType.title}</span>
          </div>
        ),
        onClick: () => {
          setMenuType({ type: 'main' });
        },
      };
      const newContext = [...menuContext, [titleItem, ...subMenu]];
      setMenuContext(newContext);
    } else {
      setMenuContext((prev) => {
        if (prev.length > 1) {
          prev.pop();
          const newContext = [...prev];
          return newContext.length === 1 ? [items] : newContext;
        }
        return prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuMap, menuType, setMenuContext, items]);

  return {
    isOpen,
    setIsOpen,
    closeMenu,
    menuType,
    menuMap,
    currentMenuItems: menuContext[menuContext.length - 1],
  };
};
