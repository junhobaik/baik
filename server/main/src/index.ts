// src/index.ts
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda';

import { type EventBody, runModuleAction } from './utils';

type LambdaFunctionUrlEvent = APIGatewayProxyEventV2;
type LambdaFunctionUrlResult = APIGatewayProxyResultV2;

export const handler = async (event: LambdaFunctionUrlEvent, context: Context): Promise<LambdaFunctionUrlResult> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  };

  if (!event.body) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({
        success: false,
        message: 'No body provided',
      }),
    };
  }

  const body: EventBody = JSON.parse(event.body);

  let sessionToken: string | undefined;
  const authHeader = event.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) sessionToken = authHeader.split('Bearer ')[1];

  const runModuleResult = await runModuleAction(body, sessionToken);

  if (runModuleResult) return { headers: headers, ...runModuleResult };

  return {
    statusCode: 500,
    headers: headers,
    body: JSON.stringify({
      status: 200,
      message: 'Unknown error',
    }),
  };
};
