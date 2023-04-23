import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { ReactComponent as IconBurger } from 'assets/icons/burger.svg';
import { Button } from 'components/common/button';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { Link, PathNames, useNavigate } from 'libs/routing';
import { MyLocationGenerics } from 'components/trade/useTradeTokens';
import { MenuItem } from './MenuItem';
import { externalLinks } from 'libs/routing/routes';
import { ReactComponent as IconTwitter } from 'assets/logos/twitter.svg';
import { ReactComponent as IconYoutube } from 'assets/logos/youtube.svg';
import { ReactComponent as IconDiscord } from 'assets/logos/discord.svg';
import { ReactComponent as IconTelegram } from 'assets/logos/telegram.svg';
import { ReactComponent as IconArrow } from 'assets/icons/arrow-cut.svg';
import { ReactComponent as IconV } from 'assets/icons/v.svg';
import { openUrlInNewTab } from '../../utils';
import { useFiatCurrency } from 'hooks/useFiatCurrency';

export type Item = {
  content: string | ReactElement;
  children?: Item[];
  onClick: () => void;
};

export const MainMenuRightBurger: FC = () => {
  const navigate = useNavigate<MyLocationGenerics>();
  const { selectedFiatCurrency, setSelectedFiatCurrency, availableCurrencies } =
    useFiatCurrency();

  const [isOpen, setIsOpen] = useState(false);

  let items: Item[] = useMemo(() => {
    return [
      {
        content: (
          <div className="flex w-full items-center justify-between">
            <span>Currency</span>
            <span className="mr-10 font-weight-500">
              {selectedFiatCurrency}
            </span>
          </div>
        ),
        children: availableCurrencies.map((currency) => {
          const isCurrencySelected = currency === selectedFiatCurrency;

          return {
            content: (
              <div className={`flex gap-20 ${isCurrencySelected ? '' : ''}`}>
                <span>{currency}</span>
                <span className="flex items-center">
                  {isCurrencySelected && <IconV className="h-12 w-12" />}
                </span>
              </div>
            ),
            onClick: () => {
              setSelectedFiatCurrency(currency);
              setCurrentItems(items);
              setIsOpen(false);
            },
          };
        }),
        onClick: function () {
          if (this?.children) {
            setCurrentItems([
              {
                content: (
                  <div className="flex items-center gap-10">
                    <IconArrow className="h-12 w-7 rotate-180" />
                    <span className="font-weight-500">Currency</span>
                  </div>
                ),
                onClick: () => {
                  setCurrentItems(items);
                },
              },
              ...this?.children,
            ]);
          }
        },
      },
      {
        content: 'Resources',
        children: [
          {
            content: 'Tech Docs',
            onClick: () => {
              openUrlInNewTab(externalLinks.techDocs);
              setIsOpen(false);
            },
          },
          {
            content: 'Litepaper',
            onClick: () => {
              openUrlInNewTab(externalLinks.litePaper);
              setIsOpen(false);
            },
          },
          {
            content: 'Whitepaper',
            onClick: () => {
              openUrlInNewTab(externalLinks.whitepaper);
              setIsOpen(false);
            },
          },
          {
            content: 'Simulator Repo',
            onClick: () => {
              openUrlInNewTab(externalLinks.simulatorRepo);
              setIsOpen(false);
            },
          },
          {
            content: 'Interactive Simulator',
            onClick: () => {
              openUrlInNewTab(externalLinks.interactiveSim);
              setIsOpen(false);
            },
          },
        ],
        onClick: function () {
          if (this?.children) {
            setCurrentItems([
              {
                content: (
                  <div className="flex items-center gap-10">
                    <IconArrow className="h-12 w-7 rotate-180" />
                    <span className="font-weight-500">Resources</span>
                  </div>
                ),
                onClick: () => {
                  setCurrentItems(items);
                },
              },
              ...this?.children,
            ]);
          }
        },
      },
      {
        content: 'Analytics',
        onClick: () => {
          openUrlInNewTab(externalLinks.analytics);
          setIsOpen(false);
        },
      },
      {
        content: 'Blog',
        onClick: () => {
          openUrlInNewTab(externalLinks.blog);
          setIsOpen(false);
        },
      },
      {
        content: 'Terms of Use',
        onClick: () => {
          navigate({ to: PathNames.terms });
          setIsOpen(false);
        },
      },
      {
        content: 'Privacy Policy',
        onClick: () => {
          navigate({ to: PathNames.privacy });
          setIsOpen(false);
        },
      },
      {
        content: (
          <div className="flex w-full justify-between">
            <Link to={externalLinks.twitter}>
              <IconTwitter />
            </Link>
            <Link to={externalLinks.youtube}>
              <IconYoutube />
            </Link>
            <Link to={externalLinks.discord}>
              <IconDiscord />
            </Link>
            <Link to={externalLinks.telegram}>
              <IconTelegram />
            </Link>
          </div>
        ),
        onClick: () => setIsOpen(false),
      },
    ];
  }, [
    availableCurrencies,
    navigate,
    selectedFiatCurrency,
    setSelectedFiatCurrency,
  ]);

  const [currentItems, setCurrentItems] = useState(items);

  useEffect(() => {
    if (isOpen) {
      setCurrentItems(items);
    }
  }, [isOpen, items]);

  return (
    <DropdownMenu
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="opacity-1 rounded-[10px] bg-emphasis py-8 px-8 text-16 font-weight-400 text-white"
      button={(onClick) => (
        <Button
          variant={'secondary'}
          onClick={() => {
            setIsOpen(true);
            onClick();
          }}
          className={'relative !p-0'}
        >
          <span className="flex h-36 w-36 items-center justify-center">
            <span className="relative flex inline-flex h-36 w-36 items-center justify-center rounded-full">
              <IconBurger className="h-14" />
            </span>
          </span>
        </Button>
      )}
    >
      {currentItems?.map((item, index) => (
        <MenuItem key={`${index}_${item.content}`} item={item} />
      ))}
    </DropdownMenu>
  );
};
