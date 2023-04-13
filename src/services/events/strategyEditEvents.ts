import { sendGTMEvent } from './googleTagManager';
import {
  CarbonEvents,
  EventCategory,
  StrategyGTMEventType,
} from './googleTagManager/types';
import { prepareGtmStrategyData } from './strategyEvents';
import { StrategyEventType } from './types';
export interface EventStrategyEditSchema extends EventCategory {
  strategyDuplicateClick: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyDelete: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyChangeRatesClick: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyChangeRates: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyDepositClick: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyDeposit: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyWithdraw: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyWithdrawClick: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
  strategyPause: {
    input: StrategyEventType;
    gtmData: StrategyGTMEventType;
  };
}

export const strategyEditEvents: CarbonEvents['strategyEdit'] = {
  strategyDuplicateClick: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    sendGTMEvent('strategyEdit', 'strategyDuplicateClick', {
      ...gtmData,
      strategy_id: strategy.strategyId,
    });
  },
  strategyDelete: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    sendGTMEvent('strategyEdit', 'strategyDelete', {
      ...gtmData,
      strategy_id: strategy.strategyId,
    });
  },
  strategyChangeRatesClick: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    sendGTMEvent('strategyEdit', 'strategyChangeRatesClick', {
      ...gtmData,
      strategy_id: strategy.strategyId,
    });
  },
  strategyChangeRates: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    sendGTMEvent('strategyEdit', 'strategyChangeRates', {
      ...gtmData,
      strategy_id: strategy.strategyId,
    });
  },
  strategyDepositClick: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    sendGTMEvent('strategyEdit', 'strategyDepositClick', {
      ...gtmData,
      strategy_id: strategy.strategyId,
    });
  },
  strategyDeposit: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    sendGTMEvent('strategyEdit', 'strategyDeposit', {
      ...gtmData,
      strategy_id: strategy.strategyId,
    });
  },
  strategyWithdraw: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    sendGTMEvent('strategyEdit', 'strategyWithdraw', {
      ...gtmData,
      strategy_id: strategy.strategyId,
    });
  },
  strategyWithdrawClick: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    sendGTMEvent('strategyEdit', 'strategyWithdrawClick', {
      ...gtmData,
      strategy_id: strategy.strategyId,
    });
  },
  strategyPause: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    sendGTMEvent('strategyEdit', 'strategyPause', {
      ...gtmData,
      strategy_id: strategy.strategyId,
    });
  },
};
