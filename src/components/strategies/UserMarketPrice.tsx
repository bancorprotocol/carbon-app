import { useMarketPrice } from 'hooks/useMarketPrice';
import { Token } from 'libs/tokens';
import { createContext, FC, ReactNode, useContext } from 'react';

interface Props {
  children: ReactNode;
  marketPrice?: number;
}

export const UserMarketContext = createContext(0);
export const UserMarketPrice: FC<Props> = ({ children, marketPrice }) => {
  if (!marketPrice) return null;
  return (
    <UserMarketContext.Provider value={marketPrice}>
      {children}
    </UserMarketContext.Provider>
  );
};

interface MarketPriceProps {
  base?: Token;
  quote?: Token;
}
/** Use external market price or user price */
export const useUserMarketPrice = ({ base, quote }: MarketPriceProps) => {
  const { marketPrice: externalMarketPrice } = useMarketPrice({ base, quote });
  const userMarketPrice = useContext(UserMarketContext);
  return userMarketPrice || externalMarketPrice;
};
