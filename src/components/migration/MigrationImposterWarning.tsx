import { useCanBatchTransactions } from 'libs/queries/chain/canBatch';
import { useWagmi } from 'libs/wagmi';

export const MigrationImposterWarning = () => {
  const canBatch = useCanBatchTransactions();
  const { walletAccount, user } = useWagmi();
  if (!canBatch || walletAccount === user) return;

  return (
    <section className="grid gap-16 border-warning border rounded-2xl bg-warning/20 p-16">
      <h3>⚠️ Imposter Account</h3>
      <p>
        You're seeing the account of {user}, but you're connected with{' '}
        {walletAccount}. The migration feature won't work.
      </p>
    </section>
  );
};
