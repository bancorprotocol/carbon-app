import { Link, PathNames } from 'routing';

export const StrategyBlockCreate = () => {
  return (
    <Link
      to={PathNames.createStrategy}
      className="bg-content flex h-[420px] items-center justify-center rounded-10 border-dashed"
    >
      <div className="flex flex-col items-center space-y-20">
        <div className="h-72 w-72 rounded-full bg-white text-center text-[50px] text-black">
          +
        </div>
        <h2>Create a Strategy</h2>
      </div>
    </Link>
  );
};
