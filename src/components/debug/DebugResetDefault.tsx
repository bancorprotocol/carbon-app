import { useWagmi } from 'libs/wagmi';
import { Button } from 'components/common/button';

export const DebugResetDefault = () => {
  const { handleTenderlyRPC, setImposterAccount } = useWagmi();

  const handleOnClick = () => {
    handleTenderlyRPC();
    setImposterAccount();
  };

  return (
    <div className="rounded-18 bg-background-900 flex flex-col items-center space-y-20 p-20">
      <h2>Reset to defaults</h2>
      <Button onClick={handleOnClick}>RESET</Button>
    </div>
  );
};
