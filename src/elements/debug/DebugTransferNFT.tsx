import { useState } from 'react';
import { Button } from 'components/Button';
import { Input, Label } from 'components/InputField';
import { useContract } from 'hooks/useContract';
import { useWeb3 } from 'web3';

export const DebugTransferNFT = () => {
  const { user } = useWeb3();
  const { Voucher } = useContract();
  const [inputId, setInputId] = useState('');
  const [inputRecipient, setInputRecipient] = useState('');

  const handleOnClick = async () => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const tx = await Voucher.write.transferFrom(
        user,
        inputRecipient,
        inputId
      );
    } catch (e) {
      console.error('failed to transfer NFT', e);
    }
  };

  return (
    <div
      className={
        'bg-secondary flex flex-col items-center space-y-20 rounded-18 p-20'
      }
    >
      <h2>Transfer Strategy NFT</h2>
      <Label label={'Strategy ID'}>
        <Input
          type={'number'}
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          fullWidth
        />
      </Label>
      <Label label={'Recipient'}>
        <Input
          value={inputRecipient}
          onChange={(e) => setInputRecipient(e.target.value)}
          fullWidth
        />
      </Label>
      <Button onClick={handleOnClick}>Confirm</Button>
    </div>
  );
};
