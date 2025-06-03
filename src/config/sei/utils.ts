import { isAddress } from 'ethers/lib/utils';
import { Token, TokenList } from 'libs/tokens';
import {
  DragonSwapTokenList,
  GitRepoResponse,
  NetworkDataType,
} from 'config/sei/types';

export const tokenSeiListParser =
  (networkId: string) => (data: Record<string, NetworkDataType[]>) => {
    const networkTokens: Token[] = data[networkId]
      .filter((networkData) => {
        if (networkData.type_asset === 'erc721') {
          return false;
        }
        const hasBaseAddress = isAddress(networkData.base);
        const hasPointerAddress =
          !!networkData.pointer_contract?.address &&
          isAddress(networkData.pointer_contract.address);
        return (
          networkData.base !== 'usei' && (hasBaseAddress || hasPointerAddress)
        );
      })
      .map((networkData) => {
        const tokenAddress = isAddress(networkData.base)
          ? networkData.base
          : networkData.pointer_contract!.address;
        return {
          name: networkData.name,
          address: tokenAddress,
          symbol: networkData.symbol,
          decimals: networkData.denom_units[1].exponent,
          logoURI:
            networkData.images.svg ?? networkData.images.png ?? undefined,
        };
      });
    const parsedData: TokenList = {
      id: networkId,
      name: 'SEI Network',
      tokens: networkTokens,
    };
    return parsedData;
  };

const getGitFolderContent = async (gitRepoInfoApi: string) => {
  const controller = new AbortController();
  const abort = setTimeout(() => {
    controller.abort();
  }, 10000);
  const response = await fetch(gitRepoInfoApi, {
    signal: controller.signal,
    headers: {
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
    },
  });
  clearTimeout(abort);
  return response.json();
};

export const tokenDragonswapListParser =
  (repo: string, logoPath: string) => async (data: DragonSwapTokenList) => {
    const gitRepoInfoApi = `https://api.github.com/repos/${repo}/contents/${logoPath}`;
    const assetLogoPath = `https://raw.githubusercontent.com/${repo}/main/${logoPath}`;

    const logosFolder = (await getGitFolderContent(
      gitRepoInfoApi,
    )) as GitRepoResponse[];
    const logos: string[] = logosFolder
      .filter((r) => isAddress(r.name))
      .map((r) => r.name);

    const networkTokens: Token[] = data.tokens.map((d) => {
      return {
        name: d.name,
        address: d.address,
        symbol: d.symbol,
        decimals: d.decimals,
        logoURI: logos.includes(d.address)
          ? `${assetLogoPath}/${d.address}/logo.png`
          : '',
      };
    });
    const parsedData: TokenList = {
      id: 'DragonSwap',
      name: 'Sei Network',
      tokens: networkTokens,
    };

    return parsedData;
  };
