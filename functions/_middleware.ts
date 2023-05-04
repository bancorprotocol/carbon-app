import { isIpBlocked } from '../cfFunctions/ipBlock';
import { CFWorkerEnv } from '../cfFunctions/types';

export const onRequest: PagesFunction<CFWorkerEnv> = async ({
  request,
  env,
  next,
}) => {
  const isIpBlockedResponse = isIpBlocked(request, env);
  if (isIpBlockedResponse) {
    return isIpBlockedResponse;
  }
  return await next();
};
