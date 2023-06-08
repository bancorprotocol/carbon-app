import { useMemo } from 'react';
import { useTranslation } from 'libs/translations';
import { useModal } from 'hooks/useModal';
import { Button } from 'components/common/button';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import { ReactComponent as IconWallet1 } from 'assets/icons/wallet-1.svg';
import { ReactComponent as IconWallet2 } from 'assets/icons/wallet-2.svg';
import { ReactComponent as IconWallet3 } from 'assets/icons/wallet-3.svg';
import { ReactComponent as IconWallet4 } from 'assets/icons/wallet-4.svg';
import { ReactComponent as IconWallet5 } from 'assets/icons/wallet-5.svg';
import { ReactComponent as IconWallet6 } from 'assets/icons/wallet-6.svg';

export const WalletConnect = () => {
  const { t } = useTranslation();
  const { openModal } = useModal();

  // TODO: think of better location for items
  const items = useMemo(
    () => [
      {
        icon: <IconWallet1 className="h-20 w-20 text-green" />,
        title: t('pages.strategyOverview.noStrategyCard.content1'),
      },
      {
        icon: <IconWallet2 className="h-20 w-20 text-green" />,
        title: t('pages.strategyOverview.noStrategyCard.content2'),
      },
      {
        icon: <IconWallet3 className="h-20 w-20 text-green" />,
        title: t('pages.strategyOverview.noStrategyCard.content3'),
      },
      {
        icon: <IconWallet4 className="h-20 w-20 text-green" />,
        title: t('pages.strategyOverview.noStrategyCard.content4'),
      },
      {
        icon: <IconWallet5 className="h-20 w-20 text-green" />,
        title: t('pages.strategyOverview.noStrategyCard.content5'),
      },
      {
        icon: <IconWallet6 className="h-20 w-20 text-green" />,
        title: t('pages.strategyOverview.noStrategyCard.content6'),
      },
    ],
    [t]
  );

  return (
    <div className="md:h-[calc(100vh-300px)] md:min-h-[400px]">
      <div
        className={
          'h-full justify-center rounded-10 border border-emphasis p-20 md:flex'
        }
      >
        <div
          className={
            'f-full flex flex-col justify-center space-y-30 md:w-[360px]'
          }
        >
          <h1>{t('pages.strategyOverview.noStrategyCard.title')}</h1>
          <p className={'text-white/60'}>
            {t('pages.strategyOverview.noStrategyCard.subtitle')}
          </p>

          <Button
            className="flex items-center justify-center space-x-16"
            variant={'success'}
            onClick={() => openModal('wallet', undefined)}
            fullWidth
            size={'lg'}
          >
            <IconWallet className="h-20 w-20" />
            <span>
              {t('pages.strategyOverview.noStrategyCard.actionButton')}
            </span>
          </Button>
        </div>
        <div
          className={
            'my-50 flex items-center md:mx-50 md:my-0 md:h-full md:w-1'
          }
        >
          <div className={'h-1 w-[300px] bg-silver md:h-[300px] md:w-1'}></div>
        </div>
        <div className={'flex h-full flex-col justify-center space-y-33'}>
          {items.map((item, index) => (
            <div className={'flex items-center space-x-20'} key={index}>
              {item.icon}
              <span className={'text-white/80'}>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
