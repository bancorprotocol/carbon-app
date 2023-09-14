import { useWeb3 } from 'libs/web3';
import { useState } from 'react';
import { lsService } from 'services/localeStorage';
import { Button } from 'components/common/button';
import { Input, Label } from 'components/common/inputField';
import { config } from 'services/web3/config';
import { Checkbox } from 'components/common/Checkbox/Checkbox';

export const DebugTenderlyRPC = () => {
  const { handleTenderlyRPC, isUncheckedSigner, setIsUncheckedSigner } =
    useWeb3();
  const [urlInput, setUrlInput] = useState(
    lsService.getItem('tenderlyRpc') || ''
  );
  const [carbonControllerInput, setCarbonControllerInput] = useState(
    config.carbon.carbonController
  );

  const [voucherAddressInput, setVoucherAddressInput] = useState(
    config.carbon.voucher
  );

  const handleOnClick = () => {
    handleTenderlyRPC(urlInput, carbonControllerInput, voucherAddressInput);
  };

  return (
    <div
      className={
        'bg-secondary flex flex-col items-center space-y-20 rounded-18 p-20'
      }
    >
      <h2>Set Tenderly RPC</h2>
      <Label label={'RPC URL'}>
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          fullWidth
        />
      </Label>

      {urlInput && (
        <>
          <Label label={'Carbon Controller Contract'}>
            <Input
              value={carbonControllerInput}
              onChange={(e) => setCarbonControllerInput(e.target.value)}
              fullWidth
            />
          </Label>

          <Label label={'Carbon Voucher Contract'}>
            <Input
              value={voucherAddressInput}
              onChange={(e) => setVoucherAddressInput(e.target.value)}
              fullWidth
            />
          </Label>
        </>
      )}

      <div
        className={
          'flex w-full items-center space-x-20 rounded-full bg-black px-20 py-10'
        }
      >
        <Checkbox
          data-testid="unchecked-signer"
          isChecked={isUncheckedSigner}
          setIsChecked={setIsUncheckedSigner}
        />
        <span>Unchecked Signer</span>
      </div>

      <Button data-testid="save-rpc" onClick={handleOnClick}>
        Save
      </Button>
    </div>
  );
};
