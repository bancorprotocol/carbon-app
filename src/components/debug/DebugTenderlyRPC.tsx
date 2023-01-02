import { useWeb3 } from 'libs/web3';
import { useState } from 'react';
import { lsService } from 'services/localeStorage';
import { Button } from 'components/common/button';
import { Input, Label } from 'components/common/inputField';

export const DebugTenderlyRPC = () => {
  const { handleTenderlyRPC } = useWeb3();
  const [input, setInput] = useState(lsService.getItem('tenderlyRpc') || '');

  const handleOnClick = () => {
    handleTenderlyRPC(input);
  };

  return (
    <div
      className={
        'bg-secondary flex flex-col items-center space-y-20 rounded-18 p-20'
      }
    >
      <h2>Set Tenderly RPC</h2>
      <Label>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
        />
      </Label>
      <Button onClick={handleOnClick}>Save</Button>
    </div>
  );
};
