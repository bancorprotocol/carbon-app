const tenderlyId = '4a59c786-adf3-4d04-8e6c-e09ac4a029f2';
const apiUrl = `${process.env.BACKEND_TENDERLY_API}/preview/backends`;
export const proxyUrl = `${process.env.BACKEND_TENDERLY_API}/v1/proxy/${tenderlyId}/`;

const getBackendStatus = async () => {
  const res = await fetch(`${apiUrl}/${tenderlyId}`);
  if (!res.ok) return 'errir';
  const result = await res.json();
  return result.status;
};

export const doesBackendExist = async () => {
  const status = await getBackendStatus();
  return status === 'ready';
};

const waitUntilCreated = async () => {
  const max = Date.now() + 10 * 60 * 1000; // in 10min
  let ready = false;
  while (!ready && max > Date.now()) {
    await new Promise((res) => setTimeout(res, 30_000)); // every 30sec
    ready = await doesBackendExist();
  }
  return ready;
};

export const waitForBackend = async () => {
  const status = await getBackendStatus();
  if (status === 'creating') {
    const ready = await waitUntilCreated();
    if (!ready) throw new Error('Timeout before creation');
  } else {
    return status === 'ready';
  }
};

export const createBackend = async () => {
  const res = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify({ tenderlyId }),
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const error = await res.json();
    console.error(error);
    throw new Error('Could not create backend');
  }
  await waitForBackend();
};
