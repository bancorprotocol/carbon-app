import { FC, useMemo } from 'react';
import { useTokens } from 'hooks/useTokens';
import { SafeDecimal } from 'libs/safedecimal';
import { useGetMultipleTokenPrices } from 'libs/queries/extApi/tokenPrice';
import { Dexes } from 'services/uniswap/utils';
import { NotFound } from 'components/common/NotFound';
import { Token } from 'libs/tokens';
import { useDexesMigration } from 'libs/queries/migration/positions';
import { MigrationTable } from 'components/migration/MigrationTable';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { MigrationList } from 'components/migration/MigrationList';
import { MigrationLoading } from 'components/migration/MigrationLoading';
import { MigrationFetching } from 'components/migration/MigrationFetching';

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

type MigrationQuery = ReturnType<typeof useDexesMigration>;

export const MigratePage = () => {
  const query = useDexesMigration();

  return (
    <div className="grid gap-8 grid-area-[list]">
      <MigrationFetching queryState={query.states} />
      <MigrationContent query={query} />
    </div>
  );
};

interface Props {
  query: MigrationQuery;
}

const MigrationContent: FC<Props> = ({ query }) => {
  const { getTokenById, isPending } = useTokens();
  const { aboveBreakpoint } = useBreakpoints();

  const tokens = useMemo(() => {
    if (query.isLoading) return;
    const positions = query.data;
    if (!positions?.length) return;
    const list = new Set<string>();
    for (const position of positions) {
      list.add(position.base);
      list.add(position.quote);
    }
    return Array.from(list);
  }, [query.data, query.isLoading]);

  // Create a dedicated cache
  const marketPriceQuery = useGetMultipleTokenPrices(tokens);

  const positions = useMemo((): undefined | MigratedPosition[] => {
    if (isPending) return;
    if (marketPriceQuery.isPending) return;
    if (query.isLoading) return;
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
    isPending,
    marketPriceQuery.data,
    marketPriceQuery.isPending,
    query.data,
    query.isLoading,
  ]);

  if (isPending || query.isLoading) {
    return <MigrationLoading />;
  }

  if (!positions?.length) {
    return (
      <NotFound
        className="surface rounded-2xl"
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
