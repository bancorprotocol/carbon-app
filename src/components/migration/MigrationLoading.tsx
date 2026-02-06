import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import style from './MigrationLoading.module.css';

const sentences = [
  "Once loaded, you'll be able to transform your AMM positions into Carbon strategies",
  'Hold on, we are connecting to the blockchain...',
  'Fetching historical blockchain data...',
  'There is a lot of data... hold tight...',
  'Reading information from multiple AMM...',
  "You'll see, it's worth the time",
];
export const MigrationLoading = () => {
  return (
    <section className="grid-area-[list] grid gap-16 place-items-center">
      <CarbonLogoLoading className="h-80 " />
      <ul className="grid-stack-container place-items-center p-16 overflow-clip text-2xl text-center">
        {sentences.map((sentence, i) => (
          <li
            key={i}
            className={style.loadingSentence}
            style={{ animationDelay: `${i * 3}s` }}
          >
            {sentence}
          </li>
        ))}
      </ul>
    </section>
  );
};
