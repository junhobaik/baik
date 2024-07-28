// src/utils.ts
import modules from '../modules';
import auth from '../modules/auth';

export * from './etc.ts';

export type ModulesType = typeof modules;
export type Modules = keyof ModulesType;
export type ModuleActions<M extends Modules> = keyof ModulesType[M];

export type EventBody<M extends Modules = Modules, A extends ModuleActions<M> = ModuleActions<M>> = {
  module: M;
  action: A;
  payload: any;
};

export type ModuleAction<T = any, R = any> = {
  run: (payload: T) => Promise<R>;
  skip_auth?: boolean;
};

export interface ActionResult {
  statusCode: number;
  body: string;
}

export const runModuleAction = async <M extends Modules, A extends ModuleActions<M>>(
  body: EventBody<M, A>,
  sessionToken?: string,
): Promise<ActionResult> => {
  if (!isValidEventBody(body)) {
    return createErrorResponse(400, 'Invalid request: module and action are required');
  }

  const targetModule = modules[body.module];
  if (!targetModule) {
    return createErrorResponse(404, 'Module not found');
  }

  const targetAction = targetModule[body.action] as ModuleAction;
  if (!targetAction || typeof targetAction.run !== 'function') {
    return createErrorResponse(404, 'Action not found');
  }

  try {
    // Authenticated
    if (!targetAction.skip_auth) {
      if (!sessionToken) return createErrorResponse(401, 'Unauthorized, session token is required');

      const authResponse = await auth.verifySession.run({ sessionToken });
      const isMatchUserId = authResponse.data?.item?.userId === '533ea867-72c4-42af-872d-17bf11c9c5a1';
      const isVerified = !!authResponse.data?.verified;

      if (!isMatchUserId) return createErrorResponse(401, 'Unauthorized, invalid user id');
      if (!isVerified) return createErrorResponse(401, 'Unauthorized, invalid session token');
    }

    const res = await targetAction.run(body.payload);
    return createSuccessResponse(res);
  } catch (err) {
    console.error(`Error in runModuleAction [${body.module}>${body.action}]:`, err);
    return createErrorResponse(500, 'Internal server error!' + (err as any).message, {
      code: 'INTERNAL_SERVER_ERROR',
      message: err as any,
    });
  }
};

const isValidEventBody = <M extends Modules, A extends ModuleActions<M>>(body: any): body is EventBody<M, A> => {
  return (
    typeof body === 'object' &&
    body !== null &&
    'module' in body &&
    'action' in body &&
    typeof body.module === 'string' &&
    typeof body.action === 'string' &&
    body.module in modules &&
    body.action in (modules[body.module as Modules] || {})
  );
};

const createErrorResponse = (
  statusCode: number,
  message: string,
  error?: { code?: string; message?: string },
): ActionResult => {
  return {
    statusCode,
    body: JSON.stringify({ status: statusCode, message, error }),
  };
};

const createSuccessResponse = (data: { data: Record<string, any>; message?: string }): ActionResult => {
  return {
    statusCode: 200,
    body: JSON.stringify({ status: 200, ...data }),
  };
};

export { isValidEventBody, createErrorResponse, createSuccessResponse };
