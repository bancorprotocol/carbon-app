import { FC, useMemo } from 'react';
import { exchangeNames, QuoteMetadata } from 'services/openocean';

interface Props {
  path: QuoteMetadata[];
}

export const RoutingExchanges: FC<Props> = ({ path }) => {
  const exchanges = useMemo(() => {
    const set = new Set(
      path.map((p) => p.exchange).filter((e) => e !== 'Unwrap'),
    );
    return Array.from(set);
  }, [path]);
  return (
    <ul className="flex gap-8 text-12 flex-wrap">
      {exchanges.map((exchange) => (
        <li
          className="text-nowrap p-8 border border-main-400 rounded-2xl"
          key={exchange}
        >
          {exchangeNames[exchange]}
        </li>
      ))}
    </ul>
  );
};
