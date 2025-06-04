import { hexValue } from '@ethersproject/bytes';
import { parseUnits } from '@ethersproject/units';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { lsService } from 'services/localeStorage';
import config from 'config';

export interface FaucetToken {
  decimals: number;
  tokenContract: string;
  donorAccount: string;
  symbol: string;
}

export const tenderlyRpc = lsService.getItem('tenderlyRpc');

export const getUncheckedSigner = (user: string, rpcUrl = tenderlyRpc) =>
  new StaticJsonRpcProvider(rpcUrl).getUncheckedSigner(user);

export const FAUCET_TOKENS: FaucetToken[] = config.tenderly.faucetTokens;

export const tenderlyFaucetTransferNativeToken = async (user: string) => {
  const provider = new StaticJsonRpcProvider(tenderlyRpc);
  await provider.send('tenderly_setBalance', [
    [user],
    hexValue(parseUnits('1000', 'ether').toHexString()),
  ]);
};

export const tenderlyFaucetTransferTKN = async (
  token: FaucetToken,
  user: string,
) => {
  const provider = new StaticJsonRpcProvider(tenderlyRpc);
  return provider.send('tenderly_setErc20Balance', [
    token.tokenContract,
    user,
    hexValue(parseUnits('1000', token.decimals)),
  ]);
};
