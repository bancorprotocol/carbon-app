import { ReactComponent as IconEllipse } from 'assets/icons/ellipse.svg';

export const StrategyNotFound = () => {
  return (
    <div className="flex flex-grow items-center justify-center p-20">
      <div className=" w-[209px] text-center font-weight-500">
        <div className="mx-auto mb-32 w-80 rounded-full bg-silver p-16">
          <IconEllipse />
        </div>
        <div className="text-36">Strategy Not Found</div>
      </div>
    </div>
  );
};
