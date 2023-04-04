import { sendEvent } from '.';
import { CarbonEvents, EventCategory, StrategyType } from './types';

export interface EventStrategyEditSchemaNew extends EventCategory {
  strategyDuplicateClick: {
    input: StrategyType;
    gtmData: StrategyType;
  };
  strategyDelete: {
    input: StrategyType;
    gtmData: StrategyType;
  };
  strategyChangeRatesClick: {
    input: StrategyType;
    gtmData: StrategyType;
  };
  strategyChangeRates: {
    input: StrategyType;
    gtmData: StrategyType;
  };
  strategyDepositClick: {
    input: StrategyType;
    gtmData: StrategyType;
  };
  strategyDeposit: {
    input: StrategyType;
    gtmData: StrategyType;
  };
  strategyWithdraw: {
    input: StrategyType;
    gtmData: StrategyType;
  };
  strategyWithdrawClick: {
    input: StrategyType;
    gtmData: StrategyType;
  };
  strategyPause: {
    input: StrategyType;
    gtmData: StrategyType;
  };
}

export const strategyEditEvents: CarbonEvents['strategyEdit'] = {
  strategyDuplicateClick: (strategy) => {
    sendEvent('strategyEdit', 'strategyDuplicateClick', strategy);
  },
  strategyDelete: (strategy) => {
    sendEvent('strategyEdit', 'strategyDelete', strategy);
  },
  strategyChangeRatesClick: (strategy) => {
    sendEvent('strategyEdit', 'strategyChangeRatesClick', strategy);
  },
  strategyChangeRates: (strategy) => {
    sendEvent('strategyEdit', 'strategyChangeRates', strategy);
  },
  strategyDepositClick: (strategy) => {
    sendEvent('strategyEdit', 'strategyDepositClick', strategy);
  },
  strategyDeposit: (strategy) => {
    sendEvent('strategyEdit', 'strategyDeposit', strategy);
  },
  strategyWithdraw: (strategy) => {
    sendEvent('strategyEdit', 'strategyWithdraw', strategy);
  },
  strategyWithdrawClick: (strategy) => {
    sendEvent('strategyEdit', 'strategyWithdrawClick', strategy);
  },
  strategyPause: (strategy) => {
    sendEvent('strategyEdit', 'strategyPause', strategy);
  },
};
