type FnArgumentTypes<F extends Function> = F extends (...args: infer A) => any
  ? A
  : never;

type FnReturnType<F extends Function> = F extends (...args: infer A) => any
  ? ReturnType<F>
  : never;

type ThreadFn = <T extends Function>(
  fn: T,
  ...args: FnArgumentTypes<T>
) => Promise<FnReturnType<T>>;

const _thread = (fnWorker: string, ...args: any[]): any => {
  if (!window.Worker)
    throw Promise.reject(new ReferenceError(`WebWorkers aren't available.`));

  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([fnWorker], { type: 'text/javascript' });
      const blobUrl = window.URL.createObjectURL(blob);
      const worker = new Worker(blobUrl);
      window.URL.revokeObjectURL(blobUrl);

      worker.onmessage = (result) => {
        resolve(result.data);
        worker.terminate();
      };

      worker.onerror = (error) => {
        reject(error);
        worker.terminate();
      };

      worker.postMessage(args);
    } catch (error) {
      reject(error);
    }
  });
};

export const thread: ThreadFn = (fn, ...args) => {
  const fnWorker = `
  self.onmessage = function(message) {
    self.postMessage(
      (${fn.toString()}).apply(null, message.data)
    );
  }`;

  return _thread(fnWorker, ...args);
};

export const asyncThread: ThreadFn = (fn, ...args) => {
  const fnWorker = `
  self.onmessage = function(message) {
    (${fn.toString()})
      .apply(null, message.data)
      .then(result => self.postMessage(result));
  }`;

  return _thread(fnWorker, ...args);
};
