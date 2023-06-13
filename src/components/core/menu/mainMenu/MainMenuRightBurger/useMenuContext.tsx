import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'libs/translations';
import { Menu, MenuItemType } from './useBurgerMenuItems';
import { ImmutableStack } from 'utils/stack';
import { ReactComponent as IconArrow } from 'assets/icons/arrow-cut.svg';

export enum MenuItemActions {
  Close,
  Back,
}

interface UseMenuContextProps<T> {
  mainMenu: T;
  menuMapping: Map<T, Menu>;
  defaultState?: boolean;
}

export function useMenuContext<T>(props: UseMenuContextProps<T>) {
  const { i18n } = useTranslation();
  const { mainMenu, menuMapping, defaultState } = props;

  const [isOpen, setIsOpen] = useState(defaultState || false);

  const back = useCallback(() => {
    setMenuContext((prev) => prev.pop());
  }, []);

  const getTopSubMenuItem = useCallback(
    (title?: string) => {
      return {
        content: (
          <div className="flex items-center gap-10">
            <IconArrow
              className={`h-12 w-7 ${i18n.dir() === 'ltr' ? 'rotate-180' : ''}`}
            />
            <span className="font-weight-500">{title}</span>
          </div>
        ),
        onClick: () => {
          back();
        },
      };
    },
    [back]
  );

  const forward = useCallback(
    (item: MenuItemType) => {
      setMenuContext((prev) => {
        if (item.subMenu) {
          const data = menuMapping.get(item.subMenu as T);
          if (data?.items) {
            const topSubMenuItem = getTopSubMenuItem(data?.title);

            const itemsWithClickEvents = data.items.map((item) => {
              if (item.subMenu) {
                item.onClick = () => {
                  forward(item);
                };
              } else {
                const originalClick = item.onClick?.bind(item);
                if (item.postClickAction === MenuItemActions.Back) {
                  item.onClick = () => {
                    originalClick && originalClick();
                    setMenuContext(updatedStack.pop());
                  };
                } else {
                  item.onClick = () => {
                    originalClick && originalClick();
                    closeMenu();
                  };
                }
              }
              return item;
            });

            const newStackItem = {
              title: data.title,
              items: [topSubMenuItem, ...itemsWithClickEvents],
            };
            const updatedStack = prev.push(newStackItem);
            return updatedStack;
          }
        }
        return prev;
      });
    },
    [getTopSubMenuItem, menuMapping]
  );

  const closeMenu = () => setIsOpen(false);

  const stack = ImmutableStack.create<Menu | undefined>();

  const mainItemsWithNavigationEvents =
    menuMapping.get(mainMenu)?.items.map((item) => {
      if (item.subMenu) {
        item.onClick = () => {
          forward(item);
        };
      } else {
        item.onClick = () => {
          closeMenu();
        };
      }
      return item;
    }) || [];

  const [menuContext, setMenuContext] = useState(
    stack.push({ items: mainItemsWithNavigationEvents })
  );

  useEffect(() => {
    if (!isOpen) {
      // Clean up the menu when closing
      setMenuContext((prev) => {
        const updatedStack = prev.clear();
        return updatedStack.push(menuMapping.get(mainMenu));
      });
    }
  }, [forward, isOpen, menuMapping, mainMenu]);

  return {
    isOpen,
    setIsOpen,
    closeMenu,
    menuContext,
  };
}
