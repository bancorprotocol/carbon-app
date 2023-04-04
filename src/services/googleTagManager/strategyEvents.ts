import { sendEvent } from '.';
import { CarbonEvents, EventCategory, Message, StrategyType } from './types';

export interface EventStrategySchemaNew extends EventCategory {
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
    input: StrategyType;
    gtmData: StrategyType;
  };
  strategySellHighOrderTypeChange: {
    input: StrategyType;
    gtmData: StrategyType;
  };
  strategyBuyLowPriceSet: {
    input: StrategyType;
    gtmData: StrategyType;
  };
  strategySellHighPriceSet: {
    input: StrategyType;
    gtmData: StrategyType;
  };
  strategyBuyLowBudgetSet: {
    input: StrategyType;
    gtmData: StrategyType;
  };
  strategySellHighBudgetSet: {
    input: StrategyType;
    gtmData: StrategyType;
  };
  strategyCreateClick: {
    input: StrategyType;
    gtmData: StrategyType;
  };
  strategyCreate: {
    input: StrategyType;
    gtmData: StrategyType;
  };
}

export const strategyEvents: CarbonEvents['strategy'] = {
  strategyWarningShow: ({ section, message }) => {
    sendEvent('strategy', 'strategyWarningShow', {
      section,
      message,
    });
  },
  strategyErrorShow: ({ section, message }) => {
    sendEvent('strategy', 'strategyErrorShow', {
      section,
      message,
    });
  },
  strategyTooltipShow: ({ section, message }) => {
    sendEvent('strategy', 'strategyTooltipShow', {
      section,
      message,
    });
  },
  strategyChartClose: () => {
    sendEvent('strategy', 'strategyChartClose', undefined);
  },
  strategyChartOpen: () => {
    sendEvent('strategy', 'strategyChartOpen', undefined);
  },
  newStrategyCreateClick: () => {
    sendEvent('strategy', 'newStrategyCreateClick', undefined);
  },
  strategyBaseTokenChange: ({ token }) => {
    sendEvent('strategy', 'strategyBaseTokenChange', { token });
  },
  newStrategyBaseTokenSelect: ({ token }) => {
    sendEvent('strategy', 'newStrategyBaseTokenSelect', { token });
  },
  newStrategyQuoteTokenSelect: ({ token }) => {
    sendEvent('strategy', 'newStrategyQuoteTokenSelect', { token });
  },
  strategyQuoteTokenChange: ({ token }) => {
    sendEvent('strategy', 'strategyQuoteTokenChange', { token });
  },
  strategyTokenSwap: ({ updatedBase, updatedQuote }) => {
    sendEvent('strategy', 'strategyTokenSwap', {
      token_pair_from: `${updatedQuote}/${updatedBase}`,
      token_pair: `${updatedBase}/${updatedQuote}`,
    });
  },
  strategyBuyLowOrderTypeChange: (strategy) => {
    sendEvent('strategy', 'strategyBuyLowOrderTypeChange', strategy);
  },
  strategySellHighOrderTypeChange: (strategy) => {
    sendEvent('strategy', 'strategySellHighOrderTypeChange', strategy);
  },
  strategyBuyLowPriceSet: (strategy) => {
    sendEvent('strategy', 'strategyBuyLowPriceSet', strategy);
  },
  strategySellHighPriceSet: (strategy) => {
    sendEvent('strategy', 'strategySellHighPriceSet', strategy);
  },
  strategyBuyLowBudgetSet: (strategy) => {
    sendEvent('strategy', 'strategyBuyLowBudgetSet', strategy);
  },
  strategySellHighBudgetSet: (strategy) => {
    sendEvent('strategy', 'strategySellHighBudgetSet', strategy);
  },
  strategyCreateClick: (strategy) => {
    sendEvent('strategy', 'strategyCreateClick', strategy);
  },
  strategyCreate: (strategy) => {
    sendEvent('strategy', 'strategyCreate', strategy);
  },
};
