import { JsonRpcProvider } from 'ethers';
import { UniswapV2Config } from '../utils';
import { Provider } from 'ethers';
import { Token } from 'libs/tokens';
import { getAllV2PositionsFromLogs } from './read.contract';
import { getAllV2PositionsFromBalances, TokenBalance } from './read.alchemy';
import { lsService } from 'services/localeStorage';

export const getAllV2Positions = async (
  uniConfig: UniswapV2Config,
  provider: Provider,
  userAddress: string,
  getTokenById: (address: string) => Token | undefined,
) => {
  const tenderly = lsService.getItem('tenderlyRpc');
  if (tenderly) {
    return getAllV2PositionsFromLogs(
      uniConfig,
      provider,
      userAddress,
      getTokenById,
    );
  } else {
    const url = import.meta.env.VITE_CHAIN_RPC_URL;
    if (!url) {
      throw new Error(
        'You need to set VITE_CHAIN_RPC_URL to use migration. Or use tenderly',
      );
    }
    let tokenBalances: TokenBalance[] | undefined;
    if (url.includes('alchemy.com')) {
      const alchemy = new JsonRpcProvider(url);
      const response = await alchemy.send('alchemy_getTokenBalances', [
        userAddress,
        'erc20',
      ]);
      tokenBalances = response.tokenBalances;
    } else {
      throw new Error(
        'Currently univ2 query only support Alchemy. Contact Carbondefi to add an additional API',
      );
    }
    if (!tokenBalances) {
      throw new Error('No token balances found for user ' + userAddress);
    }
    return getAllV2PositionsFromBalances(
      uniConfig,
      provider,
      tokenBalances,
      getTokenById,
    );
  }
};
