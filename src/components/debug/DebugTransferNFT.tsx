import { useState } from 'react';
import { Button } from 'components/common/button';
import { Input, InputUserAccount, Label } from 'components/common/inputField';
import { useWagmi } from 'libs/wagmi';
import { QueryKey, useQueryClient } from 'libs/queries';
import { useVoucher } from 'hooks/useContract';

export const DebugTransferNFT = () => {
  const { user } = useWagmi();
  const [inputId, setInputId] = useState('');
  const [inputRecipient, setInputRecipient] = useState('');
  const cache = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: Voucher } = useVoucher();

  const handleOnClick = async () => {
    setIsSuccess(false);
    setIsError(false);
    if (!user) {
      console.error('No user logged in');
      return;
    }
    setIsLoading(true);

    try {
      const tx = await Voucher?.write.transferFrom(
        user,
        inputRecipient,
        inputId,
      );
      await tx?.wait();
      await cache.invalidateQueries({
        queryKey: QueryKey.strategiesByUser(user),
      });
      setIsSuccess(true);
    } catch (e) {
      console.error('failed to transfer NFT', e);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={
        'rounded-18 bg-background-900 flex flex-col items-center space-y-20 p-20'
      }
    >
      <h2>Transfer Strategy NFT</h2>
      <Label label="Strategy ID">
        <Input
          type="number"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          fullWidth
        />
      </Label>
      <InputUserAccount
        label="Recipient"
        value={inputRecipient}
        onChange={(e) => setInputRecipient(e.target.value)}
      />

      {isSuccess && <p className="text-primary">Success!</p>}
      {isError && <p className="text-error">Error!</p>}
      <Button onClick={handleOnClick} disabled={isLoading}>
        {isLoading ? 'loading' : 'Confirm'}
      </Button>
    </div>
  );
};
