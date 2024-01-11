import { items } from './items';
import { Link } from 'libs/routing';
import { buttonStyles } from '../button/buttonStyles';

export const WalletConnect = () => {
  return (
    <section
      aria-labelledby="wallet-connect-title"
      className="flex flex-1 flex-col justify-evenly gap-32 rounded-10 border border-emphasis py-24 px-32 md:mt-32 md:flex-row md:items-center"
    >
      <article className="flex flex-col justify-center md:w-[360px] md:items-start">
        <h1 id="wallet-connect-title" className="text-30 md:text-36">
          Automate your Trading Strategies
        </h1>
        <p className="mt-16 mb-24 text-white/60 md:mt-24 md:mb-40">
          A decentralized protocol for automating on-chain trading strategies.
        </p>

        <Link
          to="/strategies/create"
          className={buttonStyles({ variant: 'success', size: 'lg' })}
        >
          Create strategy
        </Link>
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
