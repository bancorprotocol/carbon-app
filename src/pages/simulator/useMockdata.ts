import { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl =
  'https://gist.githubusercontent.com/alvin-yang68/825378ee22558f0ced78a2ca74c931a7/raw/AAPLStockHistory.csv';

type CSVData = {
  date: string;
  volume: string;
  open: string;
  close: string;
  high: string;
  low: string;
};

export type CandlestickData = {
  date: number;
  volume: number;
  open: number;
  close: number;
  high: number;
  low: number;
};

export const useMockdata = () => {
  const [data, setData] = useState<CandlestickData[]>([]);

  useEffect(() => {
    const row = (d: CSVData) => ({
      date: new Date(d.date).getTime(),
      volume: +d.volume,
      open: +d.open,
      close: +d.close,
      high: +d.high,
      low: +d.low,
    });
    csv(csvUrl, row).then(setData);
  }, []);

  return data;
};
