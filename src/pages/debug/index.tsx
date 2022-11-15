import { DebugImposter } from 'elements/debug/DebugImposter';
import { DebugTenderlyRPC } from 'elements/debug/DebugTenderlyRPC';
import { DebugWeb3 } from 'elements/debug/DebugWeb3';
import { Page } from 'components/Page';
import { DebugModal } from 'elements/debug/DebugModal';
import poolCollectionProxyAbi from 'abis/PoolCollection_Proxy.json';
import { useModal } from 'modals';
import { Button } from 'components/Button';
import { GetUserApprovalProps } from 'queries/chain/approval';

export type ApprovalToken = GetUserApprovalProps & {
  amount: string;
  symbol: string;
};

const approveTest: ApprovalToken[] = [
  {
    tokenAddress: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
    spenderAddress: poolCollectionProxyAbi.address,
    amount: '1000000000000000000000',
    decimals: 18,
    symbol: 'BNT',
  },
  {
    tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    spenderAddress: poolCollectionProxyAbi.address,
    amount: '1000000000000000000000',
    decimals: 6,
    symbol: 'USDC',
  },
];

export const DebugPage = () => {
  const { openModal } = useModal();

  return (
    <Page title={'Debug'}>
      <DebugWeb3 />
      <DebugTenderlyRPC />
      <DebugImposter />
      <DebugModal />

      <Button onClick={() => openModal('txConfirm', approveTest)}>
        Approve Modal
      </Button>
    </Page>
  );
};
