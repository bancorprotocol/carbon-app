import { isIpBlocked, CFWorkerEnv } from './../src/functions';

export const onRequest: PagesFunction<CFWorkerEnv> = async ({
  request,
  env,
  next,
}) => {
  return isIpBlocked(request, env) || next();
};
