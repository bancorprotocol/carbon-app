import { Link } from '@tanstack/react-router';
import { ReactComponent as IconInfo } from 'assets/icons/tooltip.svg';
import { buttonStyles } from 'components/common/button/buttonStyles';

export const SimulatorMobilePlaceholder = () => {
  return (
    <section className="my-40 mx-auto flex w-[300px] flex-col items-center gap-20 text-center ">
      <div className="rounded-full bg-emphasis p-12">
        <IconInfo className="h-24 w-24 text-white/60" />
      </div>
      <h1 className="text-18">Device not supported</h1>
      <p className="text-14 text-white/80">
        Sorry, simulator page is only accessible via a desktop device.
      </p>
      <Link to="/" className={buttonStyles()}>
        Home
      </Link>
    </section>
  );
};
