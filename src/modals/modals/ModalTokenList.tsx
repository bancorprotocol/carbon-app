import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import { wait } from '@testing-library/user-event/dist/utils';
import { Switch } from 'components/Switch';
import { orderBy } from 'lodash';
import { useState, useMemo } from 'react';
import { Token, TokenList } from 'services/tokens';
import { ReactComponent as IconEdit } from 'assets/icons/edit.svg';
import { useModal } from 'modals/ModalProvider';
import { Imager } from 'elements/Imager';
import { SearchInput } from 'components/SearchInput';

export type ModalTokenListData = {
  onClick: (token: Token) => void;
  excludedTokens?: string[];
  includedTokens?: string[];
  tokens: Token[];
  limit?: boolean;
};

const suggestedTokens = ['BNT', 'ETH', 'WBTC', 'USDC', 'USDT'];

export const ModalTokenList: ModalFC<ModalTokenListData> = ({ id, data }) => {
  const {
    onClick,
    excludedTokens = [],
    includedTokens = [],
    tokens,
    limit,
  } = data;
  const { closeModal } = useModal();
  const [search, setSearch] = useState('');
  const [manage, setManage] = useState(false);
  const [userPreferredListIds, setUserLists] = useState(['']);

  const tokensLists: TokenList[] = [];

  const onClose = async () => {
    closeModal(id);
    await wait(500);
    setManage(false);
    setSearch('');
  };

  const handleTokenlistClick = (listId: string) => {
    const alreadyPreferred = userPreferredListIds.includes(listId);

    const newUserPreferredListIds = alreadyPreferred
      ? userPreferredListIds.filter((list) => list !== listId)
      : [...userPreferredListIds, listId];

    if (newUserPreferredListIds.length === 0) return;

    //setTokenListLS(newUserPreferredListIds);
    setUserLists(newUserPreferredListIds);
  };

  const tokenName = (name: string) => {
    if (name.length < 19) return name;
    return name + '...';
  };

  const sortedTokens = useMemo(() => {
    const filtered = tokens.filter(
      (token) =>
        (includedTokens.length === 0 ||
          includedTokens.includes(token.address)) &&
        !excludedTokens.includes(token.address) &&
        (token.symbol.toLowerCase().includes(search.toLowerCase()) ||
          (token.name &&
            token.name.toLowerCase().includes(search.toLowerCase())))
    );
    return orderBy(filtered, ({ balance }) => balance ?? 0, 'desc').slice(
      0,
      limit ? 300 : filtered.length
    );
  }, [excludedTokens, includedTokens, limit, search, tokens]);

  return (
    <Modal id={id}>
      {manage ? (
        <div className="mb-20 h-full overflow-auto md:max-h-[calc(70vh-100px)]">
          <div className="space-y-15 px-20 pt-10">
            {tokensLists.map((tokenList) => {
              const isSelected = userPreferredListIds.some(
                (listId) => tokenList.name === listId
              );
              return (
                <div
                  className={`border-silver dark:border-grey flex items-center justify-between rounded border-2 px-15 py-6 ${
                    isSelected ? 'border-primary dark:border-primary-light' : ''
                  }`}
                  key={tokenList.name}
                >
                  <div className="flex items-center">
                    <Imager
                      alt="TokenList"
                      src={tokenList.logoURI}
                      className="bg-silver h-28 w-28 rounded-full"
                    />
                    <div className={'ml-15'}>
                      <div className={'text-16'}>{tokenList.name}</div>
                      <div className={'text-graphite text-12'}>
                        {tokenList.tokens.length} Tokens
                      </div>
                    </div>
                  </div>
                  <div>
                    <Switch
                      isOn={isSelected}
                      setIsOn={() => handleTokenlistClick(tokenList.name)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div className="relative mb-10 px-20">
            <SearchInput
              value={search}
              setValue={setSearch}
              className="w-full rounded-full py-10"
            />
          </div>
          <div className="h-[calc(70vh-50px)] overflow-auto px-10 pb-10 md:h-[calc(70vh-206px)]">
            <div className="pb-12">
              <SuggestedTokens
                allTokens={tokens}
                suggestedTokens={suggestedTokens}
                onClick={(token) => {
                  onClick(token);
                  onClose();
                }}
              />
            </div>
            <div className="mt-20 flex justify-between px-10">
              <div className="text-secondary pb-6">Token</div>
              <div className="text-secondary pb-6">Balance</div>
            </div>
            {sortedTokens.map((token) => {
              return (
                <button
                  key={token.address}
                  onClick={() => {
                    onClick(token);
                    onClose();
                  }}
                  className="focus:ring-primary my-5 flex w-full items-center justify-between rounded py-5 px-14 focus:ring-2"
                >
                  <div className="flex items-center">
                    <Imager
                      src={token.logoURI}
                      alt={`${token.symbol} Token`}
                      className="h-32 w-32 !rounded-full"
                    />
                    <div className="ml-15 grid justify-items-start">
                      <div className="text-16">{token.symbol}</div>
                      <div className="text-secondary text-12">
                        {tokenName(token.name ?? token.symbol)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-16">
                      {token.balance && token.balance}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <hr className="border-silver dark:border-black-low" />
          <div className="my-5 flex h-[59px] items-center justify-center">
            <button
              onClick={() => {
                //setUserLists(getTokenListLS());
                setManage(true);
              }}
              className="font-semibold text-primary"
            >
              <span className="items center flex justify-center">
                <IconEdit className="mr-4 h-[18px] w-[18px]" />
                Manage Token Lists
              </span>
              <span className="font-medium text-graphite text-12">
                Only supported tokens will be displayed
              </span>
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

interface SuggestedTokensProps {
  allTokens: Token[];
  suggestedTokens: string[];
  onClick: (token: Token) => void;
}

export const SuggestedTokens = ({
  allTokens,
  suggestedTokens,
  onClick,
}: SuggestedTokensProps) => {
  const suggestedTokenList = useMemo(
    () =>
      suggestedTokens
        .map((token) => allTokens.find((t) => t.symbol === token))
        .filter((token) => !!token),
    [allTokens, suggestedTokens]
  );

  return (
    <div className="px-10">
      <div className="text-secondary mt-10 pb-14">Popular Tokens</div>
      <div className="flex w-full space-x-8">
        {suggestedTokenList.map((token) => (
          <button
            key={token?.address}
            onClick={() => onClick(token!)}
            className="flex w-full flex-col items-center rounded-10 border-2 border-white py-8"
          >
            <Imager
              src={token!.logoURI}
              alt={`${token!.symbol} Token`}
              className="h-28 w-28 rounded-full"
            />
            <span className="text-12">{token!.symbol}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
