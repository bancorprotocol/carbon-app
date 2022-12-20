import { Button } from 'components/Button';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { DropdownMenu } from 'components/DropdownMenu';

export const FilterSort = () => {
  return (
    <DropdownMenu
      button={
        <Button variant="tertiary" className="flex items-center gap-10">
          Filter & Sort <IconChevron className="w-14" />
        </Button>
      }
    >
      <div className="grid w-[300px] gap-20 p-10">
        <div className="text-secondary text-20">Sort By</div>
        <button className="flex items-center justify-between">
          Recently Created
          {false && <IconCheck />}
        </button>
        <button className="flex items-center justify-between">
          Oldest Created
          {false && <IconCheck />}
        </button>
        <hr className="border-2 border-silver dark:border-emphasis" />
        <button className="text-secondary">View</button>
        <button className="flex items-center justify-between">
          All
          {false && <IconCheck />}
        </button>
        <button className="flex items-center justify-between">
          Active
          {false && <IconCheck />}
        </button>
        <button className="flex items-center justify-between">
          Off curve
          {false && <IconCheck />}
        </button>
      </div>
    </DropdownMenu>
  );
};
