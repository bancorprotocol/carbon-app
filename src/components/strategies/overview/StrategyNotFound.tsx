import { ReactComponent as IconEllipse } from 'assets/icons/ellipse.svg';

export const StrategyNotFound = () => {
  return (
    <div className="flex flex-grow items-center justify-center p-20">
      <div className=" font-weight-500 w-[209px] text-center">
        <div className="bg-background-900 mx-auto mb-32 w-80 rounded-full p-16">
          <IconEllipse />
        </div>
        <div className="text-36">Strategy Not Found</div>
      </div>
    </div>
  );
};
