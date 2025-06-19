import { scaleBand } from 'd3';

interface Props {
  domain: string[];
  range: number[];
  paddingInner: number;
  ticksModulo: number;
}

export const useBandScale = (props: Props) => {
  const { domain, range, paddingInner, ticksModulo } = props;
  const scale = scaleBand()
    .domain(domain)
    .range(range)
    .paddingInner(paddingInner);

  const ticks = scale
    .domain()
    .filter((_, i) => i % ticksModulo === 0)
    .map((value) => ({ value, offset: scale(value)! + scale.bandwidth() / 2 }));

  return { scale, ticks };
};
