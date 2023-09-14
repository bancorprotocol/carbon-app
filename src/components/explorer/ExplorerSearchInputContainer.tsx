import { FC, JSX, RefObject } from 'react';
import { cn } from 'utils/helpers';
import { ReactComponent as IconClose } from 'assets/icons/times.svg';

type InputAttributes = JSX.IntrinsicElements['input'];
interface Props extends Omit<InputAttributes, 'type'> {
  containerRef?: RefObject<HTMLDivElement>;
  search: string;
}

export const ExplorerSearchInputContainer: FC<Props> = (props) => {
  const { className, containerRef, children, search, ...inputProps } = props;
  return (
    <div ref={containerRef} className="flex flex-grow">
      <input
        name="search"
        type="search"
        className={cn(
          'w-full flex-grow bg-transparent outline-none',
          className
        )}
        {...inputProps}
      />
      {!!search && (
        <button type="reset" aria-label="Clear">
          <IconClose className="w-12" />
        </button>
      )}
      {children}
    </div>
  );
};
