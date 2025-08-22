import config from 'config';
interface TokenInfo {
  valid: boolean;
  type: 'jetton_masters';
  name: string;
  symbol: string;
  description: string;
  image: string;
  extra: {
    decimals: string;
  };
}
interface Metadata {
  is_indexed: boolean;
  token_info: TokenInfo[];
}

export const getTonTokenData = async (address: string) => {
  const url = new URL(`${config.network.rpc.url}/api/v3/metadata`);
  url.searchParams.append('address', address);
  const res = await fetch(url);
  const data = await res.json<Record<string, Metadata>>();
  const token = Object.values(data).at(0);
  if (token?.is_indexed) {
    const info = token?.token_info[0];
    return {
      name: info.name,
      symbol: info.symbol,
      logoURI: info.image,
      decimals: Number(info.extra.decimals),
    };
  }
};
