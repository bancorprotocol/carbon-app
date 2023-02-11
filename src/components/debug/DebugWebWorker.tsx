import { useState } from 'react';
import { Button } from 'components/common/button';
import { asyncThread, thread } from 'utils/webWorker';

const syncSampleFn = (number: number) => {
  let result = 0;
  for (let i = 0; i < number; i++) {
    result += i;
  }
  return result;
};

const asyncSampleFn = async (number: number) => {
  const wait = async (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  await wait(number);
  return 1;
};

export const DebugWebWorker = () => {
  const [result, setResult] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const asyncSample = async () => {
    setIsLoading(true);
    setResult(0);
    const result = await asyncThread(asyncSampleFn, 2000);
    setResult(result);
    setIsLoading(false);
  };

  const syncSample = async () => {
    setIsLoading(true);
    setResult(0);
    const result = await thread(syncSampleFn, 2000000000);
    setResult(result);
    setIsLoading(false);
  };

  const oldschoolSample = async () => {
    setIsLoading(true);
    setResult(0);
    const result = syncSampleFn(2000000000);
    setResult(result);
    setIsLoading(false);
  };

  return (
    <div
      className={
        'bg-secondary flex flex-col items-center space-y-20 rounded-18 p-20'
      }
    >
      <h2>Web Worker</h2>
      {isLoading && <p className={'animate-spin'}>Loading...</p>}
      <p>{result}</p>
      <Button onClick={syncSample}>Sync Function</Button>
      <Button onClick={asyncSample}>Async Function</Button>
      <Button onClick={oldschoolSample}>Sync Function w/o WebWorker</Button>
    </div>
  );
};
