import { ReactComponent as IconWallet1 } from 'assets/icons/wallet-1.svg';
import { ReactComponent as IconWallet2 } from 'assets/icons/wallet-2.svg';
import { ReactComponent as IconWallet3 } from 'assets/icons/wallet-3.svg';
import { ReactComponent as IconWallet4 } from 'assets/icons/wallet-4.svg';
import { ReactComponent as IconWallet5 } from 'assets/icons/wallet-5.svg';
import { ReactComponent as IconWallet6 } from 'assets/icons/wallet-6.svg';
import { i18n } from 'libs/translations';

export const getProductDescriptionItems = () => {
  const items = [
    {
      icon: <IconWallet1 className="h-20 w-20 text-green" />,
      title: i18n.t('pages.strategyOverview.noStrategyCard.contents.content1'),
    },
    {
      icon: <IconWallet2 className="h-20 w-20 text-green" />,
      title: i18n.t('pages.strategyOverview.noStrategyCard.contents.content2'),
    },
    {
      icon: <IconWallet3 className="h-20 w-20 text-green" />,
      title: i18n.t('pages.strategyOverview.noStrategyCard.contents.content3'),
    },
    {
      icon: <IconWallet4 className="h-20 w-20 text-green" />,
      title: i18n.t('pages.strategyOverview.noStrategyCard.contents.content4'),
    },
    {
      icon: <IconWallet5 className="h-20 w-20 text-green" />,
      title: i18n.t('pages.strategyOverview.noStrategyCard.contents.content5'),
    },
    {
      icon: <IconWallet6 className="h-20 w-20 text-green" />,
      title: i18n.t('pages.strategyOverview.noStrategyCard.contents.content6'),
    },
  ];

  return items;
};
