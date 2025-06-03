import { useWagmi } from 'libs/wagmi';
import { useState, FormEvent } from 'react';
import { lsService } from 'services/localeStorage';
import { Button } from 'components/common/button';
import { Input, Label } from 'components/common/inputField';
import { Checkbox } from 'components/common/Checkbox/Checkbox';
import { tenderlyRpc } from 'utils/tenderly';
import config from 'config';

export const DebugTenderlyRPC = () => {
  const { handleTenderlyRPC, isUncheckedSigner, setIsUncheckedSigner } =
    useWagmi();
  const [urlInput, setUrlInput] = useState(tenderlyRpc || '');
  const [backendUrl, setBackendUrl] = useState(
    lsService.getItem('carbonApi') || config.carbonApi,
  );
  const [carbonControllerInput, setCarbonControllerInput] = useState(
    config.addresses.carbon.carbonController,
  );
  const [voucherAddressInput, setVoucherAddressInput] = useState(
    config.addresses.carbon.voucher,
  );
  const [batcherAddressInput, setBatcherAddressInput] = useState(
    config.addresses.carbon.batcher,
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    handleTenderlyRPC(
      urlInput,
      carbonControllerInput,
      voucherAddressInput,
      batcherAddressInput,
    );
    lsService.setItem('carbonApi', backendUrl);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-18 bg-background-900 flex flex-col items-center space-y-20 p-20"
    >
      <h2>Set Tenderly RPC</h2>
      <Label label="RPC URL">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          fullWidth
        />
      </Label>

      {urlInput && (
        <>
          <Label label="Carbon Controller Contract">
            <Input
              value={carbonControllerInput}
              onChange={(e) => setCarbonControllerInput(e.target.value)}
              fullWidth
            />
          </Label>

          <Label label="Carbon Voucher Contract">
            <Input
              value={voucherAddressInput}
              onChange={(e) => setVoucherAddressInput(e.target.value)}
              fullWidth
            />
          </Label>

          <Label label="Carbon Batcher Contract">
            <Input
              value={batcherAddressInput}
              onChange={(e) => setBatcherAddressInput(e.target.value)}
              fullWidth
            />
          </Label>
        </>
      )}

      <div className="flex w-full items-center space-x-20 rounded-full bg-black px-20 py-10">
        <Checkbox
          data-testid="unchecked-signer"
          isChecked={isUncheckedSigner}
          setIsChecked={setIsUncheckedSigner}
        />
        <span>Unchecked Signer</span>
      </div>

      <Label label="Carbon API URL">
        <Input
          value={backendUrl}
          onChange={(e) => setBackendUrl(e.target.value)}
          fullWidth
        />
      </Label>

      <Button data-testid="save-rpc" type="submit">
        Save
      </Button>
    </form>
  );
};
