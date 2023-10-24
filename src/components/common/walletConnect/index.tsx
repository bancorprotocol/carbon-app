import { useModal } from 'hooks/useModal';
import { Button } from 'components/common/button';
import { items } from './items';

export const WalletConnect = () => {
  const { openModal } = useModal();

  const onClick = () => openModal('wallet', undefined);

  return (
    <section
      aria-labelledby="wallet-connect-title"
      className="m-20 mt-32 flex flex-1 flex-col justify-evenly gap-32 rounded-10 border border-emphasis py-24 px-32 md:flex-row md:items-center"
    >
      <article className="flex flex-col justify-center md:w-[360px] md:items-start">
        <h1 id="wallet-connect-title">Automate your Trading Strategies</h1>
        <p className="mt-24 mb-40 text-white/60">
          A fully decentralized protocol for automating on-chain trading
          strategies.
        </p>

        <Button variant="success" size="lg" onClick={onClick}>
          Create strategy
        </Button>
      </article>
      <hr className="border-t border-emphasis md:h-[300px] md:border-r" />
      <ul className="flex flex-col justify-center gap-30">
        {items.map((item, index) => (
          <li className="flex items-center gap-20" key={index}>
            {item.icon}
            <span className="text-white/80">{item.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
