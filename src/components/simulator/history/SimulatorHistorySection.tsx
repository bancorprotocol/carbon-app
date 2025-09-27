import { useNavigate } from '@tanstack/react-router';
import { Link } from 'libs/routing';
import { SimulatorHistoryEntry } from 'libs/simulator/history/types';
import { useSimulatorHistory } from './useSimulatorHistory';
import { useTokens } from 'hooks/useTokens';
import {
  cn,
  prettifyNumber,
  prettifySignedNumber,
  shortenString,
} from 'utils/helpers';
import { SimResultSummaryTokens } from 'components/simulator/result/SimResultSummaryTokens';
import { Token } from 'libs/tokens';
import { StrategyInputOrder } from 'hooks/useStrategyInput';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { fromUnixUTC, dayFormatter } from 'components/simulator/utils';

export const SimulatorHistorySection = ({
  className,
}: {
  className?: string;
}) => {
  const { history, remove } = useSimulatorHistory();
  const navigate = useNavigate();
  const tokens = useTokens();

  const handleLoad = (entry: SimulatorHistoryEntry) => {
    const baseToken = entry.search.baseToken;
    const quoteToken = entry.search.quoteToken;

    if (entry.search.type === 'recurring') {
      void navigate({
        to: '/simulate/recurring',
        search: {
          baseToken,
          quoteToken,
          buyMin: entry.search.buyMin,
          buyMax: entry.search.buyMax,
          buyBudget: entry.search.buyBudget,
          buyIsRange: entry.search.buyIsRange,
          sellMin: entry.search.sellMin,
          sellMax: entry.search.sellMax,
          sellBudget: entry.search.sellBudget,
          sellIsRange: entry.search.sellIsRange,
          start: entry.search.start,
          end: entry.search.end,
        },
      });
    } else {
      void navigate({
        to: '/simulate/overlapping',
        search: {
          baseToken,
          quoteToken,
          sellMax: entry.search.sellMax,
          sellMin: entry.search.sellMin,
          sellBudget: entry.search.sellBudget,
          buyMax: entry.search.buyMax,
          buyMin: entry.search.buyMin,
          buyBudget: entry.search.buyBudget,
          spread: entry.search.spread,
          start: entry.search.start,
          end: entry.search.end,
        },
      });
    }
  };

  const renderHistory = () => {
    if (!history.length) {
      return (
        <p
          className="text-14 text-white/60"
          data-testid="simulation-history-empty"
        >
          Run a simulation to build your history. Your last ten runs will appear
          here.
        </p>
      );
    }

    return history.map((entry) => {
      const baseToken = tokens.getTokenById(entry.search.baseToken);
      const quoteToken = tokens.getTokenById(entry.search.quoteToken);

      return (
        <HistoryTile
          key={entry.id}
          entry={entry}
          baseToken={baseToken}
          quoteToken={quoteToken}
          onLoad={() => handleLoad(entry)}
          onDelete={() => remove(entry.id)}
        />
      );
    });
  };

  return (
    <section
      className={cn('grid gap-16', className)}
      data-testid="simulation-history"
    >
      <h2 className="text-18 font-medium">Simulation History</h2>
      <div className="flex flex-wrap justify-center gap-16 md:justify-start">
        {renderHistory()}
      </div>
    </section>
  );
};

interface HistoryTileProps {
  entry: SimulatorHistoryEntry;
  baseToken?: Token;
  quoteToken?: Token;
  onLoad: () => void;
  onDelete: () => void;
}

const HistoryTile = ({
  entry,
  baseToken,
  quoteToken,
  onLoad,
  onDelete,
}: HistoryTileProps) => {
  const dateLabel = buildDateLabel(entry);
  const roiLabel = buildRoiLabel(entry);
  const roiColor =
    entry.roi === undefined
      ? 'text-white/60'
      : entry.roi >= 0
        ? 'text-success'
        : 'text-error';
  const baseSymbol = baseToken?.symbol ?? shortenString(entry.search.baseToken);
  const quoteSymbol =
    quoteToken?.symbol ?? shortenString(entry.search.quoteToken);
  const buyOrder = buildOrder(
    entry.search.buyMin,
    entry.search.buyMax,
    entry.search.buyBudget,
    entry.search.buyIsRange,
  );
  const sellOrder = buildOrder(
    entry.search.sellMin,
    entry.search.sellMax,
    entry.search.sellBudget,
    entry.search.sellIsRange,
  );

  const handleKey = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onLoad();
    }
  };

  const createLink = buildCreateLink(entry, baseToken, quoteToken);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onLoad}
      onKeyDown={handleKey}
      className={cn(
        'border border-background-700/60 bg-background-900 rounded-3xl p-20 grid w-full max-w-[360px] gap-16 transition-colors cursor-pointer sm:w-[360px]',
        'hover:border-primary/50 focus-visible:border-primary/80 focus-visible:outline-none',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-16">
        {baseToken && quoteToken ? (
          <SimResultSummaryTokens
            baseToken={baseToken}
            quoteToken={quoteToken}
            strategyType={entry.search.type}
          />
        ) : (
          <FallbackTokens entry={entry} />
        )}
        <div className="text-right">
          <span className="text-12 uppercase tracking-wide text-white/60">
            ROI
          </span>
          <p className={cn('text-20 font-medium', roiColor)}>{roiLabel}</p>
        </div>
      </div>

      {entry.search.type === 'overlapping' && (
        <p className="text-12 text-white/60">Spread: {entry.search.spread}</p>
      )}

      <HistoryOrders
        baseSymbol={baseSymbol}
        quoteSymbol={quoteSymbol}
        buy={buyOrder}
        sell={sellOrder}
      />

      <footer className="flex flex-wrap items-center justify-between gap-12 text-12 text-white/60">
        <span>{dateLabel}</span>
        <div className="flex flex-wrap items-center gap-8">
          <button
            type="button"
            className={cn(
              buttonStyles({ variant: 'secondary', size: 'sm' }),
              'px-16',
            )}
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
          >
            Delete
          </button>
          <Link
            {...createLink}
            className={cn(
              buttonStyles({ variant: 'success', size: 'sm' }),
              'px-16',
            )}
            onClick={(event) => event.stopPropagation()}
          >
            Create Strategy
          </Link>
        </div>
      </footer>
    </article>
  );
};

const buildOrder = (
  min: string,
  max: string,
  budget: string,
  isRange: boolean,
): StrategyInputOrder => ({
  min,
  max,
  budget,
  isRange,
  budgetError: '',
});

const HistoryOrders = ({
  baseSymbol,
  quoteSymbol,
  buy,
  sell,
}: {
  baseSymbol: string;
  quoteSymbol: string;
  buy: StrategyInputOrder;
  sell: StrategyInputOrder;
}) => {
  return (
    <div className="grid gap-12 text-12 text-white/80">
      <OrderSummary
        side="Sell"
        order={sell}
        baseSymbol={baseSymbol}
        quoteSymbol={quoteSymbol}
      />
      <OrderSummary
        side="Buy"
        order={buy}
        baseSymbol={baseSymbol}
        quoteSymbol={quoteSymbol}
      />
    </div>
  );
};

const OrderSummary = ({
  side,
  order,
  baseSymbol,
  quoteSymbol,
}: {
  side: 'Buy' | 'Sell';
  order: StrategyInputOrder;
  baseSymbol: string;
  quoteSymbol: string;
}) => {
  const priceUnit = `${quoteSymbol} per ${baseSymbol}`;
  const formatPrice = (value: string) => {
    if (!value) return null;
    return prettifyNumber(value);
  };
  const formattedMin = formatPrice(order.min);
  const formattedMax = formatPrice(order.max);
  const formatWithUnit = (value: string | null) => {
    if (!value) return '–';
    return `${value} ${priceUnit}`;
  };
  const isRange = order.isRange && order.min !== order.max;

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-8 text-white/80">
        <span className="text-white/60">{side}</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-8 py-2 text-10 uppercase tracking-wide text-white/60">
          {order.isRange ? 'Range' : 'Limit'}
        </span>
      </div>
      <div className="grid gap-4">
        {isRange ? (
          <>
            <div className="flex items-center justify-between gap-8">
              <span className="text-white/60">Min</span>
              <span>{formatWithUnit(formattedMin)}</span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <span className="text-white/60">Max</span>
              <span>{formatWithUnit(formattedMax)}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between gap-8">
            <span className="text-white/60">Price</span>
            <span>{formatWithUnit(formattedMin)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const buildDateLabel = (entry: SimulatorHistoryEntry) => {
  const start = fromUnixUTC(entry.search.start);
  const end = fromUnixUTC(entry.search.end);
  if (!start || !end) return 'Date range unavailable';
  return `${dayFormatter.format(start)} - ${dayFormatter.format(end)}`;
};

const buildRoiLabel = (entry: SimulatorHistoryEntry) => {
  if (entry.roi === undefined) return 'Pending';
  return `${prettifySignedNumber(entry.roi, { decimals: 2 })}%`;
};

const buildCreateLink = (
  entry: SimulatorHistoryEntry,
  baseToken?: Token,
  quoteToken?: Token,
) => {
  const baseAddress = baseToken?.address ?? entry.search.baseToken;
  const quoteAddress = quoteToken?.address ?? entry.search.quoteToken;

  if (entry.search.type === 'recurring') {
    return {
      to: '/trade/recurring',
      search: {
        base: baseAddress,
        quote: quoteAddress,
        buyMin: entry.search.buyMin,
        buyMax: entry.search.buyMax,
        buyBudget: entry.search.buyBudget,
        buySettings: entry.search.buyIsRange ? 'range' : 'limit',
        sellMin: entry.search.sellMin,
        sellMax: entry.search.sellMax,
        sellBudget: entry.search.sellBudget,
        sellSettings: entry.search.sellIsRange ? 'range' : 'limit',
      },
    } as const;
  }

  return {
    to: '/trade/overlapping',
    search: {
      base: baseAddress,
      quote: quoteAddress,
      min: entry.search.buyMin,
      max: entry.search.sellMax,
      spread: entry.search.spread,
      anchor: 'buy' as const,
      budget: entry.search.buyBudget,
    },
  } as const;
};

const FallbackTokens = ({ entry }: { entry: SimulatorHistoryEntry }) => {
  const base = shortenString(entry.search.baseToken);
  const quote = shortenString(entry.search.quoteToken);
  return (
    <div className="grid gap-4">
      <span className="text-16 font-medium">
        {base} / {quote}
      </span>
      <span className="text-12 capitalize text-white/60">
        {entry.search.type}
      </span>
    </div>
  );
};
