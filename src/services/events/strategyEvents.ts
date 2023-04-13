import { sendGTMEvent } from './googleTagManager';
import {
  CarbonEvents,
  EventCategory,
  Message,
  StrategyGTMEventType,
} from './googleTagManager/types';
import { StrategyEventType } from './types';

export interface EventStrategySchema extends EventCategory {
  strategyWarningShow: {
    input: Message;
    gtmData: Message;
  };
  strategyErrorShow: {
    input: Message;
    gtmData: Message;
  };
  strategyTooltipShow: {
    input: Message;
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
      token: string;
    };
    gtmData: {
      token: string;
    };
  };
  newStrategyQuoteTokenSelect: {
    input: {
      token: string;
    };
    gtmData: {
      token: string;
    };
  };
  strategyBaseTokenChange: {
    input: {
      token: string;
    };
    gtmData: {
      token: string;
    };
  };
  strategyQuoteTokenChange: {
    input: {
      token: string;
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
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategySellHighOrderTypeChange: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyBuyLowPriceSet: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategySellHighPriceSet: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyBuyLowBudgetSet: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategySellHighBudgetSet: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyCreateClick: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyCreate: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  newStrategyNextStepClick: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyDirectionChange: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
}

export const strategyEvents: CarbonEvents['strategy'] = {
  strategyWarningShow: ({ section, message }) => {
    sendGTMEvent('strategy', 'strategyWarningShow', {
      section,
      message,
    });
  },
  strategyErrorShow: ({ section, message }) => {
    sendGTMEvent('strategy', 'strategyErrorShow', {
      section,
      message,
    });
  },
  strategyTooltipShow: ({ section, message }) => {
    sendGTMEvent('strategy', 'strategyTooltipShow', {
      section,
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
    sendGTMEvent('strategy', 'strategyBaseTokenChange', { token });
  },
  newStrategyBaseTokenSelect: ({ token }) => {
    sendGTMEvent('strategy', 'newStrategyBaseTokenSelect', { token });
  },
  newStrategyQuoteTokenSelect: ({ token }) => {
    sendGTMEvent('strategy', 'newStrategyQuoteTokenSelect', { token });
  },
  strategyQuoteTokenChange: ({ token }) => {
    sendGTMEvent('strategy', 'strategyQuoteTokenChange', { token });
  },
  strategyTokenSwap: ({ updatedBase, updatedQuote }) => {
    sendGTMEvent('strategy', 'strategyTokenSwap', {
      token_pair_from: `${updatedQuote}/${updatedBase}`,
      token_pair: `${updatedBase}/${updatedQuote}`,
    });
  },
  strategySellHighOrderTypeChange: (strategy) => {
    const gtmStrategyData = prepareGtmSellStrategyData(strategy);
    sendGTMEvent(
      'strategy',
      'strategySellHighOrderTypeChange',
      gtmStrategyData
    );
  },
  strategySellHighBudgetSet: (strategy) => {
    const gtmStrategyData = prepareGtmSellStrategyData(strategy);
    sendGTMEvent('strategy', 'strategySellHighBudgetSet', gtmStrategyData);
  },
  strategySellHighPriceSet: (strategy) => {
    const gtmStrategyData = prepareGtmBuyStrategyData(strategy);
    sendGTMEvent('strategy', 'strategySellHighPriceSet', gtmStrategyData);
  },
  strategyBuyLowOrderTypeChange: (strategy) => {
    const gtmStrategyData = prepareGtmBuyStrategyData(strategy);
    sendGTMEvent('strategy', 'strategyBuyLowOrderTypeChange', gtmStrategyData);
  },
  strategyBuyLowPriceSet: (strategy) => {
    const gtmStrategyData = prepareGtmBuyStrategyData(strategy);
    sendGTMEvent('strategy', 'strategyBuyLowPriceSet', gtmStrategyData);
  },
  strategyBuyLowBudgetSet: (strategy) => {
    const gtmStrategyData = prepareGtmBuyStrategyData(strategy);
    sendGTMEvent('strategy', 'strategyBuyLowBudgetSet', gtmStrategyData);
  },
  strategyCreateClick: (strategy) => {
    const gtmStrategyData = prepareGtmStrategyData(strategy);
    sendGTMEvent('strategy', 'strategyCreateClick', gtmStrategyData);
  },
  strategyCreate: (strategy) => {
    const gtmStrategyData = prepareGtmStrategyData(strategy);
    sendGTMEvent('strategy', 'strategyCreate', gtmStrategyData);
  },
  newStrategyNextStepClick: ({
    baseToken,
    quoteToken,
    strategySettings,
    strategyDirection,
    strategyType,
  }) => {
    sendGTMEvent('strategy', 'newStrategyNextStepClick', {
      strategy_base_token: baseToken,
      strategy_quote_token: quoteToken,
      strategy_settings: strategySettings,
      strategy_direction: strategyDirection,
      strategy_type: strategyType,
      token_pair: `${baseToken}/${quoteToken}`,
    });
  },
  strategyDirectionChange: ({
    baseToken,
    quoteToken,
    strategySettings,
    strategyDirection,
    strategyType,
  }) => {
    sendGTMEvent('strategy', 'strategyDirectionChange', {
      strategy_base_token: baseToken,
      strategy_quote_token: quoteToken,
      strategy_settings: strategySettings,
      strategy_direction: strategyDirection,
      strategy_type: strategyType,
      token_pair: `${baseToken}/${quoteToken}`,
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
  strategyType,
  strategyDirection,
  strategySettings,
}: StrategyEventType): StrategyGTMEventType => {
  return {
    token_pair: `${baseToken}/${quoteToken}`,
    strategy_base_token: baseToken,
    strategy_quote_token: quoteToken,
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
    strategy_type: strategyType,
    strategy_direction: strategyDirection,
    strategy_settings: strategySettings,
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
  strategyType,
  strategyDirection,
  strategySettings,
}: StrategyEventType): StrategyGTMEventType => {
  return {
    token_pair: `${baseToken}/${quoteToken}`,
    strategy_base_token: baseToken,
    strategy_quote_token: quoteToken,
    strategy_sell_high_token_price: sellTokenPrice,
    strategy_sell_high_token_min_price: sellTokenPriceMin,
    strategy_sell_high_token_max_price: sellTokenPriceMax,
    strategy_sell_high_order_type: sellOrderType,
    strategy_sell_high_budget: sellBudget,
    strategy_sell_high_budget_usd: sellBudgetUsd,
    strategy_type: strategyType,
    strategy_direction: strategyDirection,
    strategy_settings: strategySettings,
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
  strategyType,
  strategyDirection,
  strategySettings,
}: StrategyEventType): StrategyGTMEventType => {
  return {
    token_pair: `${baseToken}/${quoteToken}`,
    strategy_base_token: baseToken,
    strategy_quote_token: quoteToken,
    strategy_buy_low_token_price: buyTokenPrice,
    strategy_buy_low_token_min_price: buyTokenPriceMin,
    strategy_buy_low_token_max_price: buyTokenPriceMax,
    strategy_buy_low_order_type: buyOrderType,
    strategy_buy_low_budget: buyBudget,
    strategy_buy_low_budget_usd: buyBudgetUsd,
    strategy_type: strategyType,
    strategy_direction: strategyDirection,
    strategy_settings: strategySettings,
  };
};
