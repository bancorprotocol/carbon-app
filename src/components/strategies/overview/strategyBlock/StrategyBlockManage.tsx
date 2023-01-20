import { FC } from 'react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { Button } from 'components/common/button';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';

export const StrategyBlockManage: FC<{
  manage: boolean;
  setManage: (flag: boolean) => void;
}> = ({ manage, setManage }) => {
  const items = ['Edit Strategy Name', 'Withdraw Funds', 'Delete Strategy'];

  return (
    <DropdownMenu
      isOpen={manage}
      setIsOpen={setManage}
      button={(onClick) => (
        <Button
          className="flex items-center justify-center gap-8"
          fullWidth
          variant={'black'}
          onClick={onClick}
        >
          Manage
          <IconChevron className="w-12" />
        </Button>
      )}
      className="w-full !p-10"
    >
      {items.map((item) => (
        <ManageItem key={item} title={item} setManage={setManage} />
      ))}
    </DropdownMenu>
  );
};

const ManageItem: FC<{ title: string; setManage: (flag: boolean) => void }> = ({
  title,
  setManage,
}) => {
  return (
    <div
      onClick={() => {
        setManage(false);
      }}
      className="hover:bg-body cursor-pointer rounded-6 p-12"
    >
      {title}
    </div>
  );
};
