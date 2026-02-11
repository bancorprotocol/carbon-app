import style from './DotPulse.module.css';
export const DotPulse = () => {
  return (
    <div className={style.dotpulse} aria-label="loading indicator">
      <div className="size-8 bg-main-600 rounded-full"></div>
      <div className="size-8 bg-main-600 rounded-full"></div>
      <div className="size-8 bg-main-600 rounded-full"></div>
    </div>
  );
};
