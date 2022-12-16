import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import { orderBy } from 'lodash';
import { useState, useMemo, useRef, FC } from 'react';
import { Token, useTokens } from 'tokens';
import { useModal } from 'modals/ModalProvider';
import { Imager } from 'elements/Imager';
import { SearchInput } from 'components/SearchInput';
import { wait } from 'utils/helpers';
import { useVirtualizer } from '@tanstack/react-virtual';
import { utils } from 'ethers';
import { Button } from '../../components/Button';

export type ModalTokenListData = {
  onClick: (token: Token) => void;
  excludedTokens?: string[];
  includedTokens?: string[];
};

export const ModalTokenList: ModalFC<ModalTokenListData> = ({ id, data }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const { tokens } = useTokens();
  const { onClick, excludedTokens = [], includedTokens = [] } = data;
  const { closeModal } = useModal();
  const [search, setSearch] = useState('');
  const onClose = async () => {
    closeModal(id);
    await wait(500);
    setSearch('');
  };

  const tokenName = (name: string) => {
    if (name.length < 19) return name;
    return name + '...';
  };

  const sortedTokens = useMemo(() => {
    const filtered = tokens.filter(
      (token) =>
        ((includedTokens.length === 0 ||
          includedTokens.includes(token.address)) &&
          !excludedTokens.includes(token.address) &&
          (token.symbol.toLowerCase().includes(search.toLowerCase()) ||
            (token.name &&
              token.name.toLowerCase().includes(search.toLowerCase())))) ||
        token.address.toLowerCase().includes(search.toLowerCase())
    );
    return orderBy(filtered, ({ symbol }) => symbol, 'asc');
  }, [tokens, search, excludedTokens, includedTokens]);

  const rowVirtualizer = useVirtualizer({
    count: sortedTokens.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 65,
    overscan: 10,
  });

  const showImportToken = useMemo(() => {
    const isValidAddress = utils.isAddress(search);
    return (
      isValidAddress &&
      !sortedTokens.find(
        (token) => token.address.toLowerCase() === search.toLowerCase()
      )
    );
  }, [search, sortedTokens]);

  const showNoResults = useMemo(
    () => !showImportToken && sortedTokens.length === 0,
    [showImportToken, sortedTokens]
  );

  return (
    <Modal id={id} title={'Select Token'}>
      <SearchInput
        value={search}
        setValue={setSearch}
        className="mt-20 w-full rounded-8 py-10"
      />
      {showImportToken ? (
        <ImportTokenMessage address={search} />
      ) : showNoResults ? (
        <div>no results</div>
      ) : (
        <div>
          <div className="my-20">
            <div className="text-secondary">{sortedTokens.length} Tokens</div>
          </div>
          <div
            ref={parentRef}
            style={{
              height: `390px`,
              overflow: 'auto',
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const token = sortedTokens[virtualRow.index];
                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    className={'w-full'}
                    style={{
                      position: 'absolute',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <button
                      onClick={() => {
                        onClick(token);
                        onClose();
                      }}
                      className="flex w-full items-center"
                      style={{ height: `${virtualRow.size}px` }}
                    >
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
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

const ImportTokenMessage: FC<{ address: string }> = ({ address }) => {
  const { openModal } = useModal();

  const onClick = () => {
    openModal('importToken', { address });
  };

  return (
    <>
      <div className={'mt-40 mb-20 flex w-full justify-center'}>
        <div className={'max-w-[276px] space-y-12 text-center'}>
          <h2>Token not found</h2>
          <p>
            Unfortunately we couldn't find a token for the address you entered,
            try
            <span className={'font-weight-600'}> to import a new token.</span>
          </p>
        </div>
      </div>
      <Button fullWidth onClick={onClick}>
        Import Token
      </Button>
    </>
  );
};
