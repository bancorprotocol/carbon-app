import { hexValue } from '@ethersproject/bytes';
import { parseUnits } from '@ethersproject/units';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Token__factory } from 'abis/types/factories/Token__factory';
import config from 'config';
import { lsService } from 'services/localeStorage';
import { expandToken } from 'utils/tokens';

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

const FAUCET_AMOUNT = config.tenderly.faucetAmount;

export const tenderlyFaucetTransferNativeToken = async (user: string) => {
  const provider = new StaticJsonRpcProvider(tenderlyRpc);
  await provider.send('tenderly_setBalance', [
    [user],
    hexValue(parseUnits('1000', 'ether').toHexString()),
  ]);
};

export const tenderlyFaucetTransferTKN = async (
  token: FaucetToken,
  user: string
) => {
  const signer = getUncheckedSigner(token.donorAccount);
  const tokenContract = Token__factory.connect(token.tokenContract, signer);
  await tokenContract.transfer(
    user,
    expandToken(FAUCET_AMOUNT, token.decimals)
  );
};
