import React from 'react';
import { useModal } from 'modals';
import { DebugImposter } from 'elements/debug/DebugImposter';
import { DebugTenderlyRPC } from 'elements/debug/DebugTenderlyRPC';
import { useContract } from 'hooks/useContract';

import { MainMenu } from 'elements/menu';
import { useWeb3 } from 'providers/Web3Provider';
import { DebugBalance } from 'elements/debug/DebugBalance';
import { IS_TENDERLY_FORK } from 'services/web3/web3.constants';
import { DebugWeb3 } from 'elements/debug/DebugWeb3';

export const bntToken: string = '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C';

export const App = () => {
  const { user } = useWeb3();
  const { Token } = useContract();
  const { openModal } = useModal();

  const readChain = async () => {
    try {
      const decimals = await Token(bntToken).read.decimals();
      console.log('decimals', decimals);
    } catch (e) {
      console.error(e);
    }
  };

  const writeChain = async () => {
    try {
      const tx = await Token(bntToken).write.approve(user || '', '56777000000');
      console.log('transfer', tx);
    } catch (e) {
      console.error('transfer error', e);
    }
  };

  return (
    <>
      <MainMenu />
      {IS_TENDERLY_FORK && (
        <div className={'h-[50px] bg-amber-500 text-white'}>TENDERLY FORK</div>
      )}
      <main className={'px-content'}>
        <h1 className={'text-red-600'}>Hello</h1>
        <div>
          <button
            onClick={() => openModal('dataExample', { foo: 'asd', bar: 'asd' })}
          >
            open example modal with data
          </button>
        </div>

        <div>
          <button onClick={() => openModal('tokenLists', undefined)}>
            open token list modal
          </button>
        </div>
        <div>
          <button onClick={() => readChain()}>read chain</button>
        </div>
        <div>
          <button onClick={() => writeChain()}>write chain</button>
        </div>

        <DebugWeb3 />
        <DebugTenderlyRPC />
        <DebugImposter />
        <DebugBalance />
      </main>
    </>
  );
};
