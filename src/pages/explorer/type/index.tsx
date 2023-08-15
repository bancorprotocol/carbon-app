import { cn } from 'utils/helpers';
import { ReactComponent as IconSearch } from 'assets/icons/search-eye.svg';

export const ExplorerTypePage = () => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-30 rounded-10 border-2 border-emphasis px-20 py-50 md:h-[500px]'
      )}
    >
      <div
        className={
          'flex h-72 w-72 items-center justify-center rounded-full bg-green/20'
        }
      >
        <IconSearch className={'h-32 w-32 text-green'} />
      </div>
      <h2 className={'text-[32px]'}>Explore Strategies</h2>
      <p className={'text-secondary max-w-[440px] text-center !text-16'}>
        You can search for existing strategies by wallet address or a token
        pair. Please note that you can only view the strategies and cannot take
        any actions.
      </p>
    </div>
  );
};
