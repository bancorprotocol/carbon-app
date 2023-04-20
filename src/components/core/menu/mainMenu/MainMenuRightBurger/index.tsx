import { FC, useState } from 'react';
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

export const MainMenuRightBurger: FC = () => {
  const navigate = useNavigate<MyLocationGenerics>();
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    {
      content: 'Analytics',
      onClick: () => {
        navigate({ to: externalLinks.analytics });
        setIsOpen(false);
      },
    },
    {
      content: 'Blog',
      onClick: () => {
        navigate({ to: externalLinks.blog });
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
      {items.map((item, index) => (
        <MenuItem key={`${index}_${item.content}`} {...item} />
      ))}
    </DropdownMenu>
  );
};
