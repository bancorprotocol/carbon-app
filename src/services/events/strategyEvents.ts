import { sendGTMEvent } from './googleTagManager';
import {
  CarbonEvents,
  EventCategory,
  Message,
  StrategyGTMEventType,
} from './googleTagManager/types';

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
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategySellHighOrderTypeChange: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyBuyLowPriceSet: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategySellHighPriceSet: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyBuyLowBudgetSet: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategySellHighBudgetSet: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyCreateClick: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyCreate: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  newStrategyNextStepClick: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyDirectionChange: {
    input: StrategyGTMEventType;
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
  strategyBuyLowOrderTypeChange: (strategy) => {
    sendGTMEvent('strategy', 'strategyBuyLowOrderTypeChange', {
      ...strategy,
      token_pair: `${strategy.strategy_base_token}/${strategy.strategy_quote_token}`,
    });
  },
  strategySellHighOrderTypeChange: (strategy) => {
    sendGTMEvent('strategy', 'strategySellHighOrderTypeChange', {
      ...strategy,
      token_pair: `${strategy.strategy_base_token}/${strategy.strategy_quote_token}`,
    });
  },
  strategyBuyLowPriceSet: (strategy) => {
    sendGTMEvent('strategy', 'strategyBuyLowPriceSet', {
      ...strategy,
      token_pair: `${strategy.strategy_base_token}/${strategy.strategy_quote_token}`,
    });
  },
  strategySellHighPriceSet: (strategy) => {
    sendGTMEvent('strategy', 'strategySellHighPriceSet', {
      ...strategy,
      token_pair: `${strategy.strategy_base_token}/${strategy.strategy_quote_token}`,
    });
  },
  strategyBuyLowBudgetSet: (strategy) => {
    sendGTMEvent('strategy', 'strategyBuyLowBudgetSet', {
      ...strategy,
      token_pair: `${strategy.strategy_base_token}/${strategy.strategy_quote_token}`,
    });
  },
  strategySellHighBudgetSet: (strategy) => {
    sendGTMEvent('strategy', 'strategySellHighBudgetSet', {
      ...strategy,
      token_pair: `${strategy.strategy_base_token}/${strategy.strategy_quote_token}`,
    });
  },
  strategyCreateClick: (strategy) => {
    sendGTMEvent('strategy', 'strategyCreateClick', {
      ...strategy,
      token_pair: `${strategy.strategy_base_token}/${strategy.strategy_quote_token}`,
    });
  },
  strategyCreate: (strategy) => {
    sendGTMEvent('strategy', 'strategyCreate', {
      ...strategy,
      token_pair: `${strategy.strategy_base_token}/${strategy.strategy_quote_token}`,
    });
  },
  newStrategyNextStepClick: (strategy) => {
    sendGTMEvent('strategy', 'newStrategyNextStepClick', {
      ...strategy,
      token_pair: `${strategy.strategy_base_token}/${strategy.strategy_quote_token}`,
    });
  },
  strategyDirectionChange: (strategy) => {
    sendGTMEvent('strategy', 'strategyDirectionChange', {
      ...strategy,
      token_pair: `${strategy.strategy_base_token}/${strategy.strategy_quote_token}`,
    });
  },
};
