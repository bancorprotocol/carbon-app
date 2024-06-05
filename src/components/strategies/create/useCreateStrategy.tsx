import { useEffect, useMemo, useState } from 'react';
import { ModalTokenListData } from 'libs/modals/modals/ModalTokenList';
import { useGetTokenBalance, useQueryClient } from 'libs/queries';
import { Order, useCreateStrategyQuery } from 'libs/queries';
import {
  useNavigate,
  useSearch,
  StrategyCreateSearch,
  StrategySettings,
} from 'libs/routing';
import { Token } from 'libs/tokens';
import { useWagmi } from 'libs/wagmi';
import { OrderCreate, useOrder } from 'components/strategies/create/useOrder';
import { useDuplicateStrategy } from 'components/strategies/create/useDuplicateStrategy';
import { useStrategyEventData } from 'components/strategies/create/useStrategyEventData';
import { pairsToExchangeMapping } from 'config';
import { useApproval } from 'hooks/useApproval';
import { useModal } from 'hooks/useModal';
import { useNotifications } from 'hooks/useNotifications';
import config from 'config';
import { carbonEvents } from 'services/events';
import {
  createStrategyAction,
  checkErrors,
} from 'components/strategies/create/utils';
import { checkIfOrdersOverlap, checkIfOrdersReversed } from '../utils';
import { useMarketIndication } from 'components/strategies/marketPriceIndication/useMarketIndication';
import { getRoundedSpread } from '../overlapping/utils';

const spenderAddress = config.addresses.carbon.carbonController;

export type UseStrategyCreateReturn = ReturnType<typeof useCreateStrategy>;

const getIsRange = (order: Order, setting?: StrategySettings) => {
  if (order.startRate !== order.endRate) return true;
  if (!!Number(order.startRate)) return false;
  if (!setting) return true; // Default is range
  return setting === 'overlapping' || setting === 'range';
};

const copyOrderCreate = (order: OrderCreate) => {
  return {
    budget: order.budget,
    min: order.min,
    max: order.max,
    price: order.price,
    marginalPrice: order.marginalPrice,
  };
};

export const useCreateStrategy = () => {
  const templateStrategy = useDuplicateStrategy();
  const base = templateStrategy.base;
  const quote = templateStrategy.quote;
  const cache = useQueryClient();
  const navigate = useNavigate();
  const search = useSearch({ from: '/strategies/create' });
  const {
    base: baseAddress,
    quote: quoteAddress,
    strategySettings = templateStrategy.strategySettings,
    strategyDirection = templateStrategy.strategyDirection,
    strategyType = templateStrategy.strategyType,
  } = search;

  const { user, provider } = useWagmi();
  const { openModal } = useModal();

  const [showGraph, setShowGraph] = useState(false);
  const { dispatchNotification } = useNotifications();

  const token0BalanceQuery = useGetTokenBalance(base);
  const token1BalanceQuery = useGetTokenBalance(quote);
  const order0 = useOrder(templateStrategy.order0);
  const order1 = useOrder(templateStrategy.order1);
  const baseSpread = getRoundedSpread(templateStrategy) || 0.05;
  const [spread, setSpread] = useState(baseSpread);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { marketPricePercentage: buyMarketPricePercentage } =
    useMarketIndication({
      base,
      quote,
      order: order0,
      buy: true,
    });

  const { marketPricePercentage: sellMarketPricePercentage } =
    useMarketIndication({
      base,
      quote,
      order: order1,
    });
  const isOrdersOverlap = useMemo(() => {
    return checkIfOrdersOverlap(order0, order1);
  }, [order0, order1]);

  const isOrdersReversed = useMemo(() => {
    return checkIfOrdersReversed(order0, order1);
  }, [order0, order1]);

  const mutation = useCreateStrategyQuery();

  const [selectedStrategySettings, setSelectedStrategySettings] = useState<
    | {
        to: string;
        search: StrategyCreateSearch;
      }
    | undefined
  >();

  const approvalTokens = useMemo(() => {
    const arr = [];

    if (base && +order1.budget > 0) {
      arr.push({
        ...base,
        spender: spenderAddress,
        amount: order1.budget,
      });
    }
    if (quote && +order0.budget > 0) {
      arr.push({
        ...quote,
        spender: spenderAddress,
        amount: order0.budget,
      });
    }

    return arr;
  }, [base, quote, order0.budget, order1.budget]);

  const approval = useApproval(approvalTokens);
  const strategyEventData = useStrategyEventData({
    base,
    quote,
    order0,
    order1,
  });

  const createStrategy = async () => {
    const sourceCorrect = checkErrors(order0, order1, token1BalanceQuery.data);
    const targetCorrect = checkErrors(order1, order0, token0BalanceQuery.data);

    if (!user) {
      return openModal('wallet', undefined);
    }

    const onConfirm = () => {
      const orders = {
        order0: copyOrderCreate(order0),
        order1: copyOrderCreate(order1),
      };
      // In disposable strategies, the price of the other should be 0 to avoid SDK error
      // TODO: Should be managed before sending to the SDK IMO
      if (strategyType === 'disposable') {
        if (strategyDirection === 'buy') orders.order1.price = '0';
        if (strategyDirection === 'sell') orders.order0.price = '0';
      }
      return createStrategyAction({
        base,
        quote,
        user,
        mutation,
        dispatchNotification,
        cache,
        navigate,
        strategyEventData: {
          ...strategyEventData,
          buyMarketPricePercentage,
          sellMarketPricePercentage,
        },
        setIsProcessing,
        ...orders,
      });
    };

    if (sourceCorrect && targetCorrect) {
      if (!+order0.budget && !+order1.budget) {
        return openModal('genericInfo', {
          title: 'Empty Strategy Warning',
          text: 'You are about to create a strategy with no associated budget. It will be inactive until you deposit funds.',
          variant: 'warning',
          onConfirm,
        });
      }

      if (approval.approvalRequired) {
        return openModal('txConfirm', {
          approvalTokens,
          onConfirm,
          buttonLabel: 'Create Strategy',
          eventData: {
            ...strategyEventData,
            productType: 'strategy',
            approvalTokens: approval.tokens,
            buyToken: base,
            sellToken: quote,
            blockchainNetwork: provider?.network?.name || '',
          },
          context: 'createStrategy',
        });
      }

      await onConfirm();
    }
  };

  const handleChangeTokensEvents = (isSource = false, token: Token) => {
    if (isSource) {
      !base
        ? carbonEvents.strategy.newStrategyBaseTokenSelect({
            token,
          })
        : carbonEvents.strategy.strategyBaseTokenChange({
            token,
          });
    } else {
      !quote
        ? carbonEvents.strategy.newStrategyQuoteTokenSelect({
            token,
          })
        : carbonEvents.strategy.strategyQuoteTokenChange({
            token,
          });
    }
  };

  const openTokenListModal = (isSource?: boolean) => {
    const onClick = (token: Token) => {
      const params: { base?: string; quote?: string } = {};
      handleChangeTokensEvents(isSource, token);

      if (isSource) {
        params.base = token.address;
        if (quote) params.quote = quote?.address;
      } else {
        if (base) params.base = base?.address;
        params.quote = token.address;
      }

      navigate({
        to: '/strategies/create',
        search: (search) => ({
          ...search,
          ...params,
        }),
        replace: true,
      });
      order0.resetFields();
      order1.resetFields();
    };

    const data: ModalTokenListData = {
      onClick,
      excludedTokens: [isSource ? quote?.address ?? '' : base?.address ?? ''],
      isBaseToken: isSource,
    };
    openModal('tokenLists', data);
  };

  useEffect(() => {
    setSelectedStrategySettings(undefined);
  }, [baseAddress, quoteAddress]);

  // TODO: This should be managed by a query params like "limit_range"
  useEffect(() => {
    order0.setIsRange(getIsRange(templateStrategy.order0, strategySettings));
    order1.setIsRange(getIsRange(templateStrategy.order1, strategySettings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategySettings]);

  const showTokenSelection = !strategyType || !strategySettings;
  const showTypeMenu =
    !!base && !!quote && (!strategyType || !strategySettings);
  const showOrders = !!base && !!quote && !showTypeMenu;

  useEffect(() => {
    if (!showOrders) return setShowGraph(false);
    const hasMapping =
      !!pairsToExchangeMapping[`${base?.symbol}${quote?.symbol}`];
    if (hasMapping && showOrders) {
      setShowGraph(true);
    }
    if (!base || !quote) {
      setShowGraph(false);
    }
  }, [base, quote, setShowGraph, showOrders]);

  return {
    base,
    quote,
    order0,
    order1,
    hasApprovalError: approval.isError,
    isAwaiting: mutation.isLoading,
    createStrategy,
    openTokenListModal,
    showOrders,
    token0BalanceQuery,
    token1BalanceQuery,
    showGraph,
    setShowGraph,
    showTokenSelection,
    strategyType,
    strategySettings,
    strategyDirection,
    showTypeMenu,
    selectedStrategySettings,
    setSelectedStrategySettings,
    isProcessing,
    isOrdersOverlap,
    isOrdersReversed,
    spread,
    setSpread,
  };
};
