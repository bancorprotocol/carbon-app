import { items } from './items';
import { Link } from 'libs/routing';
import { buttonStyles } from '../button/buttonStyles';

export const WalletConnect = () => {
  return (
    <section
      aria-labelledby="wallet-connect-title"
      className="rounded-10 border-background-800 flex flex-1 flex-col justify-evenly gap-32 border px-32 py-24 md:mt-32 md:flex-row md:items-center"
    >
      <article className="flex flex-col justify-center md:w-[360px] md:items-start">
        <h1 id="wallet-connect-title" className="text-30 md:text-36">
          Automate your Trading Strategies
        </h1>
        <p className="mb-24 mt-16 text-white/60 md:mb-40 md:mt-24">
          A decentralized protocol for automating on-chain trading strategies.
        </p>

        <Link
          to="/trade"
          className={buttonStyles({ variant: 'success', size: 'lg' })}
        >
          Create
        </Link>
      </article>
      <hr className="border-background-800 border-t md:h-[300px] md:border-r" />
      <ul className="gap-30 flex flex-col justify-center">
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
