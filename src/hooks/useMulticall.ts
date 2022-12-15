import { Interface, Result } from '@ethersproject/abi';
import { useContract } from 'hooks/useContract';

export interface MultiCall {
  contractAddress: string;
  interface: Interface;
  methodName: string;
  methodParameters: any[];
}

export const useMulticall = () => {
  const { Multicall } = useContract();

  const fetchMulticall = async (
    calls: MultiCall[],
    blockHeight?: number
  ): Promise<Result[]> => {
    try {
      const encoded = calls.map((call) => ({
        target: call.contractAddress,
        callData: call.interface.encodeFunctionData(
          call.methodName,
          call.methodParameters
        ),
      }));

      const encodedRes = await Multicall.read.tryAggregate(false, encoded, {
        blockTag: blockHeight,
      });

      return encodedRes.map((call, i) => {
        if (!call.success) {
          console.log('multicall failed', calls[i]);
          throw new Error('multicall failed');
        }

        return calls[i].interface.decodeFunctionResult(
          calls[i].methodName,
          call.returnData
        );
      });
    } catch (error) {
      throw error;
    }
  };

  return { fetchMulticall };
};
