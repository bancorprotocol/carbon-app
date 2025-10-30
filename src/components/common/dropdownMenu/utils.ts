import { createContext, Dispatch, useContext } from 'react';

interface MenuCtx {
  setMenuOpen: Dispatch<boolean>;
}
export const MenuContext = createContext<MenuCtx>({
  setMenuOpen: () => undefined,
});
export const useMenuCtx = () => useContext(MenuContext);
