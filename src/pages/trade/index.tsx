import { useQuery } from '@tanstack/react-query';
import { tokenList } from 'services/tokens';
// import { useCallback, useEffect, useState } from 'react';
// import { ethToken } from 'services/web3/config';

// interface TradePageProps {
//   from: string | null;
//   to: string | null;
// }

export const TradePage = () => {
  const query = useQuery(['tokens'], tokenList);
  // const tokens = []<Token>;

  // const ethOrFirst = useCallback(() => {
  //   const eth = tokens.find((x) => x.address === ethToken);
  //   return eth ? eth : tokens[0];
  // }, [tokens]);

  // const [fromToken, setFromToken] = useState(ethOrFirst());
  // const [toToken, setToToken] = useState<Token | undefined>();

  // useEffect(() => {
  //   if (tokens) {
  //     if (from) {
  //       const fromToken = tokens.find((x) => x.address === from);
  //       if (fromToken) setFromToken(fromToken);
  //       else setFromToken(ethOrFirst());
  //     } else setFromToken(ethOrFirst());

  //     if (to) {
  //       const toToken = tokens.find((x) => x.address === to);
  //       if (toToken) setToToken(toToken);
  //       else setToToken(undefined);
  //     } else setToToken(undefined);
  //   }
  // }, [from, to, tokens, ethOrFirst]);

  return (
    <div className="mx-auto flex justify-center 2xl:space-x-20">
      <div className="space-x-30 mx-auto flex w-full justify-center md:w-auto">
        <div className="w-full md:w-auto">
          <div className="widget rounded-40 md:min-w-[485px]">
            {/* <TradeWidget
              tokens={tokens}
              from={fromToken?.address}
              to={toToken?.address}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};
