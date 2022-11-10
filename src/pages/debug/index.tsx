import { DebugImposter } from 'elements/debug/DebugImposter';
import { DebugTenderlyRPC } from 'elements/debug/DebugTenderlyRPC';
import { DebugWeb3 } from 'elements/debug/DebugWeb3';
import { Page } from 'components/Page';
import { DebugModal } from 'elements/debug/DebugModal';
import { SetUserApprovalProps } from 'queries/chain/approval';
import bancorNetworkAbi from 'abis/BancorNetwork_Proxy.json';
import { useModal } from 'modals';
import { Button } from 'components/Button';

const approveTest: SetUserApprovalProps[] = [
  {
    tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    spenderAddress: bancorNetworkAbi.address,
    amount: '10',
    decimals: 6,
    symbol: 'USDT',
  },
  {
    tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    spenderAddress: bancorNetworkAbi.address,
    amount: '10',
    decimals: 6,
    symbol: 'BNT',
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
