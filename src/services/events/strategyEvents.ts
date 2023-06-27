import { Token } from 'libs/tokens';
import { sendGTMEvent } from './googleTagManager';
import {
  CarbonEvents,
  EventCategory,
  Message,
  StrategyBuyGTMEventType,
  StrategyGTMEventType,
  StrategyGTMEventTypeBase,
  StrategySellGTMEventType,
} from './googleTagManager/types';
import {
  StrategyBuyEventType,
  StrategyEventType,
  StrategyEventTypeBase,
  StrategySellEventType,
} from './types';
import { MarketPricePercentage } from 'components/strategies/marketPriceIndication/useMarketIndication';

export interface EventStrategySchema extends EventCategory {
  strategyErrorShow: {
    input: {
      buy: boolean;
      message: string;
    };
    gtmData: Message;
  };
  strategyTooltipShow: {
    input: {
      buy?: boolean | undefined;
      message: string;
    };
    gtmData: Message;
  };
  strategyChartClose: {
    input: undefined;
    gtmData: undefined;
  };
  strategyChartOpen: {
    input: undefined;
    gtmData: undefined;
  };
  newStrategyCreateClick: {
    input: undefined;
    gtmData: undefined;
  };
  newStrategyBaseTokenSelect: {
    input: {
      token: Token;
    };
    gtmData: {
      token: string;
    };
  };
  newStrategyQuoteTokenSelect: {
    input: {
      token: Token;
    };
    gtmData: {
      token: string;
    };
  };
  strategyBaseTokenChange: {
    input: {
      token: Token;
    };
    gtmData: {
      token: string;
    };
  };
  strategyQuoteTokenChange: {
    input: {
      token: Token;
    };
    gtmData: {
      token: string;
    };
  };
  strategyTokenSwap: {
    input: {
      updatedBase: string;
      updatedQuote: string;
    };
    gtmData: {
      token_pair: string;
      token_pair_from: string;
    };
  };
  strategyBuyLowOrderTypeChange: {
    input: StrategyBuyEventType & StrategyEventTypeBase;
    gtmData: StrategyBuyGTMEventType & StrategyGTMEventTypeBase;
  };
  strategyBuyLowPriceSet: {
    input: StrategyBuyEventType & StrategyEventTypeBase;
    gtmData: StrategyBuyGTMEventType & StrategyGTMEventTypeBase;
  };
  strategyBuyLowBudgetSet: {
    input: StrategyBuyEventType & StrategyEventTypeBase;
    gtmData: StrategyBuyGTMEventType & StrategyGTMEventTypeBase;
  };
  strategySellHighOrderTypeChange: {
    input: StrategySellEventType & StrategyEventTypeBase;
    gtmData: StrategySellGTMEventType & StrategyGTMEventTypeBase;
  };
  strategySellHighPriceSet: {
    input: StrategySellEventType & StrategyEventTypeBase;
    gtmData: StrategySellGTMEventType & StrategyGTMEventTypeBase;
  };
  strategySellHighBudgetSet: {
    input: StrategySellEventType & StrategyEventTypeBase;
    gtmData: StrategySellGTMEventType & StrategyGTMEventTypeBase;
  };
  strategyCreateClick: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyCreate: {
    input: StrategyEventType & {
      buyMarketPricePercentage: MarketPricePercentage;
      sellMarketPricePercentage: MarketPricePercentage;
    };
    gtmData: StrategyGTMEventType & {
      strategy_buy_low_token_market_price_percentage: string;
      strategy_buy_low_token_market_min_price_percentage: string;
      strategy_buy_low_token_market_max_price_percentage: string;
      strategy_sell_high_token_market_price_percentage: string;
      strategy_sell_high_token_market_min_price_percentage: string;
      strategy_sell_high_token_market_max_price_percentage: string;
    };
  };
  newStrategyNextStepClick: {
    input: StrategyEventTypeBase;
    gtmData: StrategyGTMEventTypeBase;
  };
  strategyDirectionChange: {
    input: StrategyEventTypeBase;
    gtmData: StrategyGTMEventTypeBase;
  };
}

export const strategyEvents: CarbonEvents['strategy'] = {
  strategyErrorShow: ({ buy, message }) => {
    sendGTMEvent('strategy', 'strategyErrorShow', {
      section: buy ? 'Buy Low' : 'Sell High',
      message,
    });
  },
  strategyTooltipShow: ({ buy, message }) => {
    sendGTMEvent('strategy', 'strategyTooltipShow', {
      section: buy ? 'Buy Low' : buy === false ? 'Sell High' : 'Token Pair',
      message,
    });
  },
  strategyChartClose: () => {
    sendGTMEvent('strategy', 'strategyChartClose', undefined);
  },
  strategyChartOpen: () => {
    sendGTMEvent('strategy', 'strategyChartOpen', undefined);
  },
  newStrategyCreateClick: () => {
    sendGTMEvent('strategy', 'newStrategyCreateClick', undefined);
  },
  strategyBaseTokenChange: ({ token }) => {
    sendGTMEvent('strategy', 'strategyBaseTokenChange', {
      token: token.symbol,
    });
  },
  newStrategyBaseTokenSelect: ({ token }) => {
    sendGTMEvent('strategy', 'newStrategyBaseTokenSelect', {
      token: token.symbol,
    });
  },
  newStrategyQuoteTokenSelect: ({ token }) => {
    sendGTMEvent('strategy', 'newStrategyQuoteTokenSelect', {
      token: token.symbol,
    });
  },
  strategyQuoteTokenChange: ({ token }) => {
    sendGTMEvent('strategy', 'strategyQuoteTokenChange', {
      token: token.symbol,
    });
  },
  strategyTokenSwap: ({ updatedBase, updatedQuote }) => {
    sendGTMEvent('strategy', 'strategyTokenSwap', {
      token_pair_from: `${updatedQuote}/${updatedBase}`,
      token_pair: `${updatedBase}/${updatedQuote}`,
    });
  },
  strategyBuyLowOrderTypeChange: (strategy) => {
    const gtmStrategyData = prepareGtmBuyStrategyData(strategy);
    gtmStrategyData &&
      sendGTMEvent(
        'strategy',
        'strategyBuyLowOrderTypeChange',
        gtmStrategyData
      );
  },
  strategyBuyLowPriceSet: (strategy) => {
    const gtmStrategyData = prepareGtmBuyStrategyData(strategy);
    gtmStrategyData &&
      sendGTMEvent('strategy', 'strategyBuyLowPriceSet', gtmStrategyData);
  },
  strategyBuyLowBudgetSet: (strategy) => {
    const gtmStrategyData = prepareGtmBuyStrategyData(strategy);
    gtmStrategyData &&
      sendGTMEvent('strategy', 'strategyBuyLowBudgetSet', gtmStrategyData);
  },
  strategySellHighBudgetSet: (strategy) => {
    const gtmStrategyData = prepareGtmSellStrategyData(strategy);
    gtmStrategyData &&
      sendGTMEvent('strategy', 'strategySellHighBudgetSet', gtmStrategyData);
  },
  strategySellHighPriceSet: (strategy) => {
    const gtmStrategyData = prepareGtmSellStrategyData(strategy);
    gtmStrategyData &&
      sendGTMEvent('strategy', 'strategySellHighPriceSet', gtmStrategyData);
  },
  strategySellHighOrderTypeChange: (strategy) => {
    const gtmStrategyData = prepareGtmSellStrategyData(strategy);
    gtmStrategyData &&
      sendGTMEvent(
        'strategy',
        'strategySellHighOrderTypeChange',
        gtmStrategyData
      );
  },
  strategyCreateClick: (strategy) => {
    const gtmStrategyData = prepareGtmStrategyData(strategy);
    gtmStrategyData &&
      sendGTMEvent('strategy', 'strategyCreateClick', gtmStrategyData);
  },
  strategyCreate: (strategy) => {
    const gtmStrategyData = prepareGtmStrategyData(strategy);

    gtmStrategyData &&
      sendGTMEvent('strategy', 'strategyCreate', {
        ...gtmStrategyData,
        strategy_buy_low_token_market_price_percentage:
          strategy.buyMarketPricePercentage.price.toString(),
        strategy_buy_low_token_market_min_price_percentage:
          strategy.buyMarketPricePercentage.min.toString(),
        strategy_buy_low_token_market_max_price_percentage:
          strategy.buyMarketPricePercentage.max.toString(),
        strategy_sell_high_token_market_price_percentage:
          strategy.sellMarketPricePercentage.price.toString(),
        strategy_sell_high_token_market_min_price_percentage:
          strategy.sellMarketPricePercentage.min.toString(),
        strategy_sell_high_token_market_max_price_percentage:
          strategy.sellMarketPricePercentage.max.toString(),
      });
  },
  newStrategyNextStepClick: ({
    baseToken,
    quoteToken,
    strategySettings,
    strategyDirection,
    strategyType,
  }) => {
    baseToken &&
      quoteToken &&
      strategySettings &&
      strategyType &&
      sendGTMEvent('strategy', 'newStrategyNextStepClick', {
        strategy_base_token: baseToken.symbol || '',
        strategy_quote_token: quoteToken.symbol || '',
        strategy_settings: strategySettings,
        strategy_direction: strategyDirection,
        strategy_type: strategyType,
        token_pair: `${baseToken.symbol}/${quoteToken.symbol}`,
      });
  },
  strategyDirectionChange: ({
    baseToken,
    quoteToken,
    strategySettings,
    strategyDirection,
    strategyType,
  }) => {
    baseToken &&
      quoteToken &&
      strategySettings &&
      strategyType &&
      sendGTMEvent('strategy', 'strategyDirectionChange', {
        strategy_base_token: baseToken.symbol || '',
        strategy_quote_token: quoteToken.symbol || '',
        strategy_settings: strategySettings,
        strategy_direction: strategyDirection,
        strategy_type: strategyType,
        token_pair: `${baseToken.symbol}/${quoteToken.symbol}`,
      });
  },
};

export const prepareGtmStrategyData = ({
  baseToken,
  quoteToken,
  buyTokenPrice,
  buyTokenPriceMin,
  buyTokenPriceMax,
  buyOrderType,
  buyBudget,
  buyBudgetUsd,
  sellTokenPrice,
  sellTokenPriceMin,
  sellTokenPriceMax,
  sellOrderType,
  sellBudget,
  sellBudgetUsd,
  strategySettings,
  strategyDirection,
  strategyType,
}: StrategyEventType): StrategyGTMEventType | undefined => {
  if (!baseToken || !quoteToken) {
    return undefined;
  }

  return {
    token_pair: `${baseToken.symbol}/${quoteToken.symbol}`,
    strategy_base_token: baseToken.symbol,
    strategy_quote_token: quoteToken.symbol,
    strategy_buy_low_token_price: buyTokenPrice,
    strategy_buy_low_token_min_price: buyTokenPriceMin,
    strategy_buy_low_token_max_price: buyTokenPriceMax,
    strategy_buy_low_order_type: buyOrderType,
    strategy_buy_low_budget: buyBudget,
    strategy_buy_low_budget_usd: buyBudgetUsd,
    strategy_sell_high_token_price: sellTokenPrice,
    strategy_sell_high_token_min_price: sellTokenPriceMin,
    strategy_sell_high_token_max_price: sellTokenPriceMax,
    strategy_sell_high_order_type: sellOrderType,
    strategy_sell_high_budget: sellBudget,
    strategy_sell_high_budget_usd: sellBudgetUsd,
    strategy_direction: strategyDirection,
    strategy_settings: strategySettings,
    strategy_type: strategyType,
  };
};

export const prepareGtmSellStrategyData = ({
  baseToken,
  quoteToken,
  sellTokenPrice,
  sellTokenPriceMin,
  sellTokenPriceMax,
  sellOrderType,
  sellBudget,
  sellBudgetUsd,
  strategySettings,
  strategyDirection,
  strategyType,
}: StrategySellEventType & StrategyEventTypeBase):
  | (StrategySellGTMEventType & StrategyGTMEventTypeBase)
  | undefined => {
  if (!baseToken || !quoteToken || !strategySettings || !strategyType) {
    return undefined;
  }
  return {
    token_pair: `${baseToken?.symbol}/${quoteToken?.symbol}`,
    strategy_base_token: baseToken?.symbol,
    strategy_quote_token: quoteToken?.symbol,
    strategy_sell_high_token_price: sellTokenPrice,
    strategy_sell_high_token_min_price: sellTokenPriceMin,
    strategy_sell_high_token_max_price: sellTokenPriceMax,
    strategy_sell_high_order_type: sellOrderType,
    strategy_sell_high_budget: sellBudget,
    strategy_sell_high_budget_usd: sellBudgetUsd,
    strategy_direction: strategyDirection,
    strategy_settings: strategySettings,
    strategy_type: strategyType,
  };
};

export const prepareGtmBuyStrategyData = ({
  baseToken,
  quoteToken,
  buyTokenPrice,
  buyTokenPriceMin,
  buyTokenPriceMax,
  buyOrderType,
  buyBudget,
  buyBudgetUsd,
  strategySettings,
  strategyDirection,
  strategyType,
}: StrategyBuyEventType & StrategyEventTypeBase):
  | (StrategyBuyGTMEventType & StrategyGTMEventTypeBase)
  | undefined => {
  if (!baseToken || !quoteToken || !strategySettings || !strategyType) {
    return undefined;
  }

  return {
    token_pair: `${baseToken.symbol}/${quoteToken.symbol}`,
    strategy_base_token: baseToken?.symbol,
    strategy_quote_token: quoteToken?.symbol,
    strategy_buy_low_token_price: buyTokenPrice,
    strategy_buy_low_token_min_price: buyTokenPriceMin,
    strategy_buy_low_token_max_price: buyTokenPriceMax,
    strategy_buy_low_order_type: buyOrderType,
    strategy_buy_low_budget: buyBudget,
    strategy_buy_low_budget_usd: buyBudgetUsd,
    strategy_direction: strategyDirection,
    strategy_settings: strategySettings,
    strategy_type: strategyType,
  };
};
