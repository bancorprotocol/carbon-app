import { useModal } from 'hooks/useModal';
import { Button } from 'components/common/button';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import { items } from './items';

export const WalletConnect = () => {
  const { openModal } = useModal();

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
          <h1>Automate your Trading Strategies</h1>
          <p className={'text-white/60'}>
            A fully decentralized protocol for automating on-chain trading
            strategies.
          </p>

          <Button
            className="flex items-center justify-center space-s-16"
            variant={'success'}
            onClick={() => openModal('wallet', undefined)}
            fullWidth
            size={'lg'}
          >
            <IconWallet className="h-20 w-20" />
            <span>Connect</span>
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
            <div className={'flex items-center space-s-20'} key={index}>
              {item.icon}
              <span className={'text-white/80'}>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
