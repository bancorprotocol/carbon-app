import { FC, useState } from 'react';
import { ReactComponent as IconBurger } from 'assets/icons/burger.svg';
import { Button } from 'components/common/button';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { PathNames, useNavigate } from 'libs/routing';
import { MyLocationGenerics } from 'components/trade/useTradeTokens';
import { MenuItem } from './MenuItem';

export const MainMenuRightBurger: FC = () => {
  const navigate = useNavigate<MyLocationGenerics>();
  const [isOpen, setIsOpen] = useState(false);

  const items = [
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
  ];

  return (
    <DropdownMenu
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="opacity-1 rounded-[10px] bg-emphasis py-8 px-10 text-16 font-weight-400 text-white"
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
      {items.map((item) => (
        <MenuItem {...item} />
      ))}
    </DropdownMenu>
  );
};
