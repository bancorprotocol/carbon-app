import { ReactElement, useMemo, useState } from 'react';
import { externalLinks, NewTabLink, Link } from 'libs/routing';
import IconX from 'assets/logos/x.svg?react';
import IconYoutube from 'assets/logos/youtube.svg?react';
import IconDiscord from 'assets/logos/discord.svg?react';
import IconTelegram from 'assets/logos/telegram.svg?react';
import { ForwardArrow } from 'components/common/forwardArrow';
import { ThemePicker } from 'components/core/ThemePicker';
import config from 'config';

export type MenuType = 'main' | 'resources';

export type Menu = ReactElement[];

const iconStyles = 'size-32 md:size-20';
const menuitemClass =
  'rounded-sm cursor-pointer text-18 md:text-16 p-10 hover:bg-main-900/40 aria-selected:bg-main-900/60 flex items-center gap-8';

export const useBurgerMenuItems = () => {
  const [currentMenu, setCurrentMenu] = useState<MenuType>('main');
  const menus = useMemo(() => {
    const menuMap = new Map<MenuType, Menu>();

    /** Main Menu */
    const mainItems: Menu = [
      <button
        key="resources"
        role="menuitem"
        onClick={() => setCurrentMenu('resources')}
        className={menuitemClass}
      >
        <span>Resources</span>
        <ForwardArrow className="ml-auto" />
      </button>,
      <hr key="divider" className="border-b border-main-700 w-full" />,
      <NewTabLink
        key="faq"
        role="menuitem"
        className={menuitemClass}
        to={externalLinks.faq}
      >
        FAQ
      </NewTabLink>,
      <NewTabLink
        key="blog"
        role="menuitem"
        className={menuitemClass}
        to={externalLinks.blog}
      >
        Blog
      </NewTabLink>,
    ];
    if (externalLinks.analytics) {
      mainItems.push(
        <NewTabLink
          key="analytics"
          role="menuitem"
          className={menuitemClass}
          to={externalLinks.analytics}
        >
          Analytics
        </NewTabLink>,
      );
    }
    if (config.ui.showTerms) {
      mainItems.push(
        <Link key="terms" role="menuitem" className={menuitemClass} to="/terms">
          Terms of Use
        </Link>,
      );
    }
    if (config.ui.showPrivacy) {
      mainItems.push(
        <Link
          key="policy"
          role="menuitem"
          className={menuitemClass}
          to="/privacy"
        >
          Privacy Policy
        </Link>,
      );
    }

    mainItems.push(<ThemePicker />);

    mainItems.push(
      <footer
        key="footer"
        className="flex w-full items-center justify-between border-t border-main-700"
      >
        <NewTabLink
          key="x"
          role="menuitem"
          className={menuitemClass}
          to={externalLinks.x}
          aria-label="X social network"
        >
          <IconX className={iconStyles} />
        </NewTabLink>
        <NewTabLink
          key="youtube"
          role="menuitem"
          className={menuitemClass}
          to={externalLinks.youtube}
          aria-label="youtube"
        >
          <IconYoutube className={iconStyles} />
        </NewTabLink>
        <NewTabLink
          key="discord"
          role="menuitem"
          className={menuitemClass}
          to={externalLinks.discord}
          aria-label="discord"
        >
          <IconDiscord className={iconStyles} />
        </NewTabLink>
        <NewTabLink
          key="telegram"
          role="menuitem"
          className={menuitemClass}
          to={externalLinks.telegram}
          aria-label="telegram"
        >
          <IconTelegram className={iconStyles} />
        </NewTabLink>
      </footer>,
    );

    menuMap.set('main', mainItems);

    /** Currency Menu */

    const resourcesItems: Menu = [
      <button
        key="resource-submenu"
        role="menuitem"
        onClick={() => setCurrentMenu('main')}
        className={menuitemClass}
      >
        <span className="rotate-180">
          <ForwardArrow />
        </span>
        <span className="font-medium">Resources</span>
      </button>,
      <hr key="divider" className="border-b border-main-700 w-full" />,
      <NewTabLink
        key="tect"
        role="menuitem"
        className={menuitemClass}
        to={externalLinks.techDocs}
      >
        Tech Docs
      </NewTabLink>,
      <NewTabLink
        key="litepaper"
        role="menuitem"
        className={menuitemClass}
        to={externalLinks.litePaper}
      >
        Litepaper
      </NewTabLink>,
      <NewTabLink
        key="whitepaper"
        role="menuitem"
        className={menuitemClass}
        to={externalLinks.whitepaper}
      >
        Whitepaper
      </NewTabLink>,
    ];
    if (externalLinks.simulatorRepo) {
      resourcesItems.push(
        <NewTabLink
          key="simulator"
          role="menuitem"
          className={menuitemClass}
          to={externalLinks.simulatorRepo}
        >
          Simulator Repo
        </NewTabLink>,
      );
    }
    if (externalLinks.duneDashboard) {
      <NewTabLink
        key="dune"
        role="menuitem"
        className={menuitemClass}
        to={externalLinks.duneDashboard}
      >
        Dune Dashboard
      </NewTabLink>;
    }
    menuMap.set('resources', resourcesItems);

    return menuMap;
  }, []);

  const menu = useMemo(() => menus.get(currentMenu)!, [currentMenu, menus]);

  return menu;
};
