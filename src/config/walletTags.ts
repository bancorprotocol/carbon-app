export type WalletTagEntry = {
  tag: string;
  address: `0x${string}`;
};

const baseWalletTags: WalletTagEntry[] = [
  {
    tag: 'example',
    address: '0x5D2ECba2D9936AC8FB3A950Fc2B572e6a607d39A',
  },
  {
    tag: 'CarbonLP',
    address: '0xcebbA9948E02eDAf948A90A86d83C9c9a00d7306',
  },
];

const walletTagsByTag = new Map(
  baseWalletTags.map((entry) => [entry.tag.toLowerCase(), entry]),
);

const walletTagsByAddress = new Map(
  baseWalletTags.map((entry) => [entry.address.toLowerCase(), entry]),
);

export const getWalletAddressForTag = (rawTag: string) => {
  const tag = rawTag.trim().toLowerCase();
  return walletTagsByTag.get(tag)?.address;
};

export const getWalletTagForAddress = (address: string) => {
  return walletTagsByAddress.get(address.toLowerCase());
};

export const searchWalletTags = (rawSearch: string) => {
  const trimmed = rawSearch.trim();
  if (!trimmed.startsWith('@')) return [];

  const query = trimmed.slice(1).toLowerCase();
  const matches = baseWalletTags.filter((entry) =>
    entry.tag.toLowerCase().includes(query),
  );

  matches.sort((a, b) => {
    const tagA = a.tag.toLowerCase();
    const tagB = b.tag.toLowerCase();
    const startsWithA = tagA.startsWith(query);
    const startsWithB = tagB.startsWith(query);
    if (startsWithA && !startsWithB) return -1;
    if (!startsWithA && startsWithB) return 1;
    return tagA.localeCompare(tagB);
  });

  return matches;
};

export const walletTags = baseWalletTags;
