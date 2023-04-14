import { sendGTMEvent } from './googleTagManager';
import {
  CarbonEvents,
  EventCategory,
  StrategyEditGTMEventType,
} from './googleTagManager/types';
import { prepareGtmStrategyData } from './strategyEvents';
import { StrategyEditEventType } from './types';

export interface EventStrategyEditSchema extends EventCategory {
  strategyDuplicateClick: {
    input: StrategyEditEventType;
    gtmData: StrategyEditGTMEventType;
  };
  strategyDelete: {
    input: StrategyEditEventType;
    gtmData: StrategyEditGTMEventType;
  };
  strategyChangeRatesClick: {
    input: StrategyEditEventType;
    gtmData: StrategyEditGTMEventType;
  };
  strategyChangeRates: {
    input: StrategyEditEventType;
    gtmData: StrategyEditGTMEventType;
  };
  strategyDepositClick: {
    input: StrategyEditEventType;
    gtmData: StrategyEditGTMEventType;
  };
  strategyDeposit: {
    input: StrategyEditEventType;
    gtmData: StrategyEditGTMEventType;
  };
  strategyWithdraw: {
    input: StrategyEditEventType;
    gtmData: StrategyEditGTMEventType;
  };
  strategyWithdrawClick: {
    input: StrategyEditEventType;
    gtmData: StrategyEditGTMEventType;
  };
  strategyPause: {
    input: StrategyEditEventType;
    gtmData: StrategyEditGTMEventType;
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
