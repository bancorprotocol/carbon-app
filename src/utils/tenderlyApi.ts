import axios from 'axios';

const projectUrl = `account/bancor/project/frontend-forks`;
const e2eTestBaseForkId = '5ac3ffc6-abcd-4fbd-8430-069d927cbff9';
const defaultNewForkName = 'e2e-disposable';

const axiosOnTenderly = axios.create({
  baseURL: 'https://api.tenderly.co/api/v1',
  headers: {
    'X-Access-Key': import.meta.env.VITE_TENDERLY_ACCESS_KEY || '',
    'Content-Type': 'application/json',
  },
});

export const duplicateFork = async (
  originalFork = e2eTestBaseForkId,
  newForkName = defaultNewForkName
) => {
  const forkResponse = await axiosOnTenderly.post(`${projectUrl}/clone-fork`, {
    fork_id: originalFork,
    alias: newForkName,
  });
  const forkId = forkResponse.data.simulation_fork.id;
  return forkId;
};

export const deleteFork = async (forkId: string) => {
  return axiosOnTenderly.delete(`${projectUrl}/fork/${forkId}`);
};
