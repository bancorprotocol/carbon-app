import { sendGTMEvent } from '.';
import { CarbonEvents, EventCategory, StrategyGTMEventType } from './types';

export interface EventStrategyEditSchemaNew extends EventCategory {
  strategyDuplicateClick: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyDelete: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyChangeRatesClick: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyChangeRates: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyDepositClick: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyDeposit: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyWithdraw: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyWithdrawClick: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyPause: {
    input: StrategyGTMEventType;
    gtmData: StrategyGTMEventType;
  };
}

export const strategyEditEvents: CarbonEvents['strategyEdit'] = {
  strategyDuplicateClick: (strategy) => {
    sendGTMEvent('strategyEdit', 'strategyDuplicateClick', strategy);
  },
  strategyDelete: (strategy) => {
    sendGTMEvent('strategyEdit', 'strategyDelete', strategy);
  },
  strategyChangeRatesClick: (strategy) => {
    sendGTMEvent('strategyEdit', 'strategyChangeRatesClick', strategy);
  },
  strategyChangeRates: (strategy) => {
    sendGTMEvent('strategyEdit', 'strategyChangeRates', strategy);
  },
  strategyDepositClick: (strategy) => {
    sendGTMEvent('strategyEdit', 'strategyDepositClick', strategy);
  },
  strategyDeposit: (strategy) => {
    sendGTMEvent('strategyEdit', 'strategyDeposit', strategy);
  },
  strategyWithdraw: (strategy) => {
    sendGTMEvent('strategyEdit', 'strategyWithdraw', strategy);
  },
  strategyWithdrawClick: (strategy) => {
    sendGTMEvent('strategyEdit', 'strategyWithdrawClick', strategy);
  },
  strategyPause: (strategy) => {
    sendGTMEvent('strategyEdit', 'strategyPause', strategy);
  },
};
