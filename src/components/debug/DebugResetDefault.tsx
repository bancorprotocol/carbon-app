import { useWeb3 } from 'libs/web3';
import { Button } from 'components/common/button';

export const DebugResetDefault = () => {
  const { handleTenderlyRPC, handleImposterAccount } = useWeb3();

  const handleOnClick = () => {
    handleTenderlyRPC();
    handleImposterAccount('');
  };

  return (
    <div
      className={
        'bg-secondary flex flex-col items-center space-y-20 rounded-18 p-20'
      }
    >
      <h2>Reset to defaults</h2>
      <Button onClick={handleOnClick}>RESET</Button>
    </div>
  );
};
