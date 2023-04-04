import { sendEvent } from '.';
import { CarbonEvents, EventCategory, Message } from './types';

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
};
