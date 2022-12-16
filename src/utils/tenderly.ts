import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Token__factory } from 'abis/types/factories/Token__factory';
import { lsService } from 'services/localeStorage';
import { expandToken } from 'utils/tokens';
import { ContractTransaction } from 'ethers';
import { IS_TENDERLY_FORK } from 'web3';
import { wait } from './helpers';

export interface FaucetToken {
  decimals: number;
  tokenContract: string;
  donorAccount: string;
}

const tenderlyRpc = lsService.getItem('tenderlyRpc');

export const getUncheckedSigner = (user: string, rpcUrl = tenderlyRpc) =>
  new StaticJsonRpcProvider(rpcUrl).getUncheckedSigner(user);

export const ETH_DONOR_ACCOUNT = '0x00000000219ab540356cbb839cbe05303d7705fa';

export const FAUCET_TOKENS: FaucetToken[] = [
  {
    donorAccount: '0x0a59649758aa4d66e25f08dd01271e891fe52199',
    tokenContract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
  },
  {
    donorAccount: '0x5777d92f208679db4b9778590fa3cab3ac9e2168',
    tokenContract: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
  },
  {
    donorAccount: '0xa744a64dfd51e4fee3360f1ec1509d329047d7db',
    tokenContract: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
    decimals: 18,
  },
];

const FAUCET_AMOUNT = 100000;

export const tenderlyFaucetTransferETH = async (user: string) => {
  const ethSigner = getUncheckedSigner(ETH_DONOR_ACCOUNT);
  await ethSigner.sendTransaction({
    to: user,
    value: expandToken(FAUCET_AMOUNT, 18),
  });
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

export const txWait = async (tx: ContractTransaction) => {
  if (IS_TENDERLY_FORK) {
    console.log('txWait start', tx.hash);
    await tx.wait();
    await wait(5000);
    console.log('txWait done', tx.hash);
  } else {
    await tx.wait();
  }
};
