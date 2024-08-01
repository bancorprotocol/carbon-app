import { Outlet } from '@tanstack/react-router';

export const TradePortfolio = () => {
  return (
    <>
      <Outlet />
      <section className="col-span-2">
        <div>Portfolio</div>
      </section>
    </>
  );
};
