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
    input: StrategyEditEventType & {
      buyLowDepositBudget: string;
      buyLowDepositBudgetUsd: string;
      sellHighDepositBudget: string;
      sellHighDepositBudgetUsd: string;
    };
    gtmData: StrategyEditGTMEventType & {
      strategy_buy_low_deposit_budget: string;
      strategy_buy_low_deposit_budget_usd: string;
      strategy_sell_high_deposit_budget: string;
      strategy_sell_high_deposit_budget_usd: string;
    };
  };
  strategyWithdraw: {
    input: StrategyEditEventType & {
      buyLowWithdrawalBudget: string;
      buyLowWithdrawalBudgetUsd: string;
      sellHighWithdrawalBudget: string;
      sellHighWithdrawalBudgetUsd: string;
    };
    gtmData: StrategyEditGTMEventType & {
      strategy_buy_low_withdrawal_budget: string;
      strategy_buy_low_withdrawal_budget_usd: string;
      strategy_sell_high_withdrawal_budget: string;
      strategy_sell_high_withdrawal_budget_usd: string;
    };
  };
  strategyWithdrawClick: {
    input: StrategyEditEventType;
    gtmData: StrategyEditGTMEventType;
  };
  strategyPause: {
    input: StrategyEditEventType;
    gtmData: StrategyEditGTMEventType;
  };
  strategyRenew: {
    input: StrategyEditEventType;
    gtmData: StrategyEditGTMEventType;
  };
  strategyManageClick: {
    input: StrategyEditEventType;
    gtmData: StrategyEditGTMEventType;
  };
}

export const strategyEditEvents: CarbonEvents['strategyEdit'] = {
  strategyDuplicateClick: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    gtmData &&
      sendGTMEvent('strategyEdit', 'strategyDuplicateClick', {
        ...gtmData,
        strategy_id: strategy.strategyId,
      });
  },
  strategyDelete: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    gtmData &&
      sendGTMEvent('strategyEdit', 'strategyDelete', {
        ...gtmData,
        strategy_id: strategy.strategyId,
      });
  },
  strategyChangeRatesClick: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    gtmData &&
      sendGTMEvent('strategyEdit', 'strategyChangeRatesClick', {
        ...gtmData,
        strategy_id: strategy.strategyId,
      });
  },
  strategyChangeRates: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    gtmData &&
      sendGTMEvent('strategyEdit', 'strategyChangeRates', {
        ...gtmData,
        strategy_id: strategy.strategyId,
      });
  },
  strategyDepositClick: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    gtmData &&
      sendGTMEvent('strategyEdit', 'strategyDepositClick', {
        ...gtmData,
        strategy_id: strategy.strategyId,
      });
  },
  strategyDeposit: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    gtmData &&
      sendGTMEvent('strategyEdit', 'strategyDeposit', {
        ...gtmData,
        strategy_id: strategy.strategyId,
        strategy_buy_low_deposit_budget: strategy.buyLowDepositBudget,
        strategy_buy_low_deposit_budget_usd: strategy.buyLowDepositBudgetUsd,
        strategy_sell_high_deposit_budget: strategy.sellHighDepositBudget,
        strategy_sell_high_deposit_budget_usd:
          strategy.sellHighDepositBudgetUsd,
      });
  },
  strategyWithdraw: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    gtmData &&
      sendGTMEvent('strategyEdit', 'strategyWithdraw', {
        ...gtmData,
        strategy_id: strategy.strategyId,
        strategy_buy_low_withdrawal_budget: strategy.buyLowWithdrawalBudget,
        strategy_buy_low_withdrawal_budget_usd:
          strategy.buyLowWithdrawalBudgetUsd,
        strategy_sell_high_withdrawal_budget: strategy.sellHighWithdrawalBudget,
        strategy_sell_high_withdrawal_budget_usd:
          strategy.sellHighWithdrawalBudgetUsd,
      });
  },
  strategyWithdrawClick: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    gtmData &&
      sendGTMEvent('strategyEdit', 'strategyWithdrawClick', {
        ...gtmData,
        strategy_id: strategy.strategyId,
      });
  },
  strategyPause: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    gtmData &&
      sendGTMEvent('strategyEdit', 'strategyPause', {
        ...gtmData,
        strategy_id: strategy.strategyId,
      });
  },
  strategyRenew: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    gtmData &&
      sendGTMEvent('strategyEdit', 'strategyRenew', {
        ...gtmData,
        strategy_id: strategy.strategyId,
      });
  },
  strategyManageClick: (strategy) => {
    const gtmData = prepareGtmStrategyData(strategy);
    gtmData &&
      sendGTMEvent('strategyEdit', 'strategyManageClick', {
        ...gtmData,
        strategy_id: strategy.strategyId,
      });
  },
};
