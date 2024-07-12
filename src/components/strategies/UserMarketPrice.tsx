import { useMarketPrice } from 'hooks/useMarketPrice';
import { Token } from 'libs/tokens';
import { createContext, FC, ReactNode, useContext } from 'react';

interface Props {
  children: ReactNode;
  marketPrice?: number;
}

export const OverlappingMarketPriceContext = createContext(0);
export const OverlappingMarketPriceProvider: FC<Props> = ({
  children,
  marketPrice,
}) => {
  if (!marketPrice) return null;
  return (
    <OverlappingMarketPriceContext.Provider value={marketPrice}>
      {children}
    </OverlappingMarketPriceContext.Provider>
  );
};

interface MarketPriceProps {
  base?: Token;
  quote?: Token;
}
/** Use external market price or user price */
export const useOverlappingMarketPrice = ({
  base,
  quote,
}: MarketPriceProps) => {
  const { marketPrice: externalMarketPrice } = useMarketPrice({ base, quote });
  const userMarketPrice = useContext(OverlappingMarketPriceContext);
  return userMarketPrice || externalMarketPrice;
};
