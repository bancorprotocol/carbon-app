import { useMemo } from 'react';
import { useTokens } from 'hooks/useTokens';
import { SafeDecimal } from 'libs/safedecimal';
import { useGetMultipleTokenPrices } from 'libs/queries/extApi/tokenPrice';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { Dexes } from 'services/uniswap/utils';
import { NotFound } from 'components/common/NotFound';
import { Token } from 'libs/tokens';
import { useMigrationPositions } from 'libs/queries/migration/positions';
import { MigrationTable } from 'components/migration/MigrationTable';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { MigrationList } from 'components/migration/MigrationList';

interface MigratedPosition {
  id: string;
  dex: Dexes;
  base: Token;
  quote: Token;
  spread: string;
  buy: {
    min: string;
    marginalPrice: string;
    max: string;
    budget: string;
    fee: string;
  };
  sell: {
    min: string;
    marginalPrice: string;
    max: string;
    budget: string;
    fee: string;
  };
  fiat: {
    base: {
      budget: string;
      fee: string;
    };
    quote: {
      budget: string;
      fee: string;
    };
    total: {
      budget: string;
      fee: string;
    };
  };
}

export const MigratePage = () => {
  const { getTokenById } = useTokens();
  const { aboveBreakpoint } = useBreakpoints();

  const query = useMigrationPositions();

  const tokens = useMemo(() => {
    const positions = query.data;
    if (!positions?.length) return;
    const list = new Set<string>();
    for (const position of positions) {
      list.add(position.base);
      list.add(position.quote);
    }
    return Array.from(list);
  }, [query.data]);

  // Create a dedicated cache
  const marketPriceQuery = useGetMultipleTokenPrices(tokens);

  const positions = useMemo((): undefined | MigratedPosition[] => {
    if (marketPriceQuery.isPending) return;
    if (query.isPending) return;
    const marketPrices = marketPriceQuery.data || {};
    return query.data?.map((pos) => {
      const basePrice = new SafeDecimal(marketPrices[pos.base]);
      const quotePrice = new SafeDecimal(marketPrices[pos.quote]);
      const baseBudgetFiat = basePrice.mul(pos.baseLiquidity);
      const baseFeeFiat = basePrice.mul(pos.baseFee);
      const quoteBudgetFiat = quotePrice.mul(pos.quoteLiquidity);
      const quoteFeeFiat = quotePrice.mul(pos.quoteFee);
      return {
        id: pos.id,
        dex: pos.dex,
        base: getTokenById(pos.base)!,
        quote: getTokenById(pos.quote)!,
        spread: new SafeDecimal(pos.fee).div(10_000).toString(),
        buy: {
          min: pos.min.toString(),
          marginalPrice: '',
          max: '',
          budget: pos.quoteLiquidity,
          fee: pos.quoteFee,
        },
        sell: {
          min: '',
          marginalPrice: '',
          max: pos.max.toString(),
          budget: pos.baseLiquidity,
          fee: pos.baseFee,
        },
        fiat: {
          base: {
            budget: baseBudgetFiat.toString(),
            fee: baseFeeFiat.toString(),
          },
          quote: {
            budget: quoteBudgetFiat.toString(),
            fee: quoteFeeFiat.toString(),
          },
          total: {
            budget: baseBudgetFiat.add(quoteBudgetFiat).toString(),
            fee: baseFeeFiat.add(quoteFeeFiat).toString(),
          },
        },
      };
    });
  }, [
    getTokenById,
    marketPriceQuery.data,
    marketPriceQuery.isPending,
    query.data,
    query.isPending,
  ]);

  if (query.isPending) {
    return <CarbonLogoLoading className="h-80 grid-area-[list]" />;
  }

  if (!positions?.length) {
    return (
      <NotFound
        className="grid-area-[list] surface rounded-2xl"
        title="No Position Found"
        text=""
        variant="info"
      />
    );
  }

  if (aboveBreakpoint('lg')) {
    return <MigrationTable positions={positions} />;
  }

  return <MigrationList positions={positions} />;
};

export const PositionCard = () => {};
