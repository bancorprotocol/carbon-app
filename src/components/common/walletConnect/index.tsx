import { items } from './items';
import { Link } from 'libs/routing';

export const WalletConnect = () => {
  return (
    <section
      aria-labelledby="wallet-connect-title"
      className="bg-main-900 justify-self-stretch rounded-lg border-main-800 flex flex-1 flex-col justify-evenly gap-32 border px-32 py-24 md:mt-32 md:flex-row md:items-center"
    >
      <article className="flex flex-col justify-center md:w-[360px] md:items-start">
        <h1 id="wallet-connect-title" className="text-30 md:text-36">
          Automate your Trading Strategies
        </h1>
        <p className="mb-24 mt-16 text-white/60 md:mb-40 md:mt-24">
          A decentralized protocol for automating on-chain trading strategies.
        </p>

        <Link to="/trade" className="btn-primary-gradient">
          Create
        </Link>
      </article>
      <hr className="border-main-800 border-t md:h-[300px] md:border-r" />
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
