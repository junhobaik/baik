import { request } from './request';

interface VerifySessionArgs {
  sessionToken: string;
}

export const verifySession = async (args: VerifySessionArgs) => {
  const { sessionToken } = args;

  const param = {
    module: 'auth',
    action: 'verifySession',
    payload: {
      sessionToken,
    },
  };

  const res = await request(param);
  return res;
};
