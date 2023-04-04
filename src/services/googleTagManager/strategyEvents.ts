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
};
