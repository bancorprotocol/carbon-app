import { setupServer } from 'msw/node';
import { HttpResponse, http, RequestHandler } from 'msw';
import { debugTokens } from '../../../../e2e/utils/types';
import tokenListsMock from '../../../../e2e/mocks/tokenLists.json';
import { Order, Strategy } from 'libs/queries';
import { TokenPriceHistoryResult } from 'libs/queries/extApi/tokenPrice';

/**
 * Creates a handler for fetching market rates based on the provided market rates object.
 * This handler intercepts HTTP GET requests to the 'market-rate' endpoint,
 * extracts the 'address' query parameter, and returns the corresponding market rates
 * from the provided marketRates object. If the address is not found, it returns a 404 response.
 *
 * @param {Record<string, Record<string, number>>} marketRates - An object mapping addresses
 *        to their respective market rates. Each address key maps to another object where
 *        each key is a market identifier and its value is the rate.
 * @returns An HTTP handler function that can be passed to the MockServer handlers
 */
export const marketRateHandler = (
  marketRates: Record<string, Record<string, number>>,
) => {
  return http.get('**/*/market-rate', ({ request }) => {
    const queryParams = new URL(request.url).searchParams;
    const address = queryParams.get('address')?.toLowerCase();
    if (!address || !marketRates[address])
      return new HttpResponse(null, { status: 404 });

    return HttpResponse.json({
      data: marketRates[address],
    });
  });
};

export const priceHistoryHandler = (data: TokenPriceHistoryResult[]) => {
  return http.get('**/*/history/prices', () => HttpResponse.json({ data }));
};

/**
 * Array of HTTP GET request handlers for each token list URL defined in `tokenLists.json`.
 * Each handler intercepts requests to its corresponding URL and returns the associated token list data
 * as a JSON response. If the requested token list does not exist in `tokenListsMock`, a 404 response is returned.
 */
export const tokenListHandlers = Object.keys(tokenListsMock).map(
  (tokenList) => {
    return http.get(tokenList, () => {
      const json = tokenListsMock[tokenList as keyof typeof tokenListsMock];
      if (!json) return new HttpResponse(null, { status: 404 });

      return HttpResponse.json({
        data: json,
      });
    });
  },
);

/**
 * MockServer is a utility class for managing a mock server for testing.
 * It allows adding and resetting request handlers for the server.
 */
export class MockServer {
  private server;

  /**
   * Constructs a new instance of MockServer.
   * @param {RequestHandler[]} handlers - An optional array of initial request handlers.
   */
  constructor(private handlers: RequestHandler[] = []) {
    this.server = setupServer(...this.handlers);
  }

  /**
   * Adds a new request handler to the server.
   * @param {RequestHandler} handler - The request handler to add.
   */
  addHandler(handler: RequestHandler) {
    this.handlers.push(handler);
    this.server.resetHandlers(...this.handlers);
  }

  /**
   * Resets the server's request handlers to their initial state.
   * @param {RequestHandler[]} handlers - An optional array of initial request handlers.
   */
  reset(handlers?: RequestHandler[]) {
    this.server.resetHandlers(...(handlers ?? []));
  }

  /**
   * Starts the mock server and sets up vitest lifecycle hooks to listen for requests
   * and close the server before and after all tests, respectively.
   */
  start() {
    this.server.listen({ onUnhandledRequest: 'error' });
  }

  /**
   * Close the mock server.
   */
  close() {
    this.server.close();
  }
}

export const tokenList = {
  USDT: {
    address: debugTokens.USDT,
    decimals: 6,
    symbol: 'USDT',
  },
  WBTC: {
    address: debugTokens.WBTC,
    decimals: 8,
    symbol: 'WBTC',
  },
  USDC: {
    address: debugTokens.USDC,
    decimals: 6,
    symbol: 'USDC',
  },
  ETH: {
    address: debugTokens.ETH,
    decimals: 18,
    symbol: 'ETH',
  },
};

type TokenNames = keyof typeof tokenList;

type MockMarketRateParams = Partial<{
  [token in TokenNames]: number;
}>;
export const mockMarketRate = (params: MockMarketRateParams) => {
  const rates: Record<string, Record<string, number>> = {};
  for (const [key, value] of Object.entries(params)) {
    const address = tokenList[key as TokenNames].address.toLowerCase();
    rates[address] = { USD: value };
  }
  return rates;
};

export interface MockStrategyParams {
  base: TokenNames;
  quote: TokenNames;
  order0: Order;
  order1: Order;
}

export const mockStrategy = (params: MockStrategyParams): Strategy => ({
  id: '1',
  idDisplay: '1',
  base: tokenList[params.base],
  quote: tokenList[params.quote],
  status: 'active',
  encoded: {} as any,
  order0: params.order0,
  order1: params.order1,
});

export const mockEmptyOrder = (balance: string = '0'): Order => ({
  balance,
  startRate: '0',
  endRate: '0',
  marginalRate: '0',
});
