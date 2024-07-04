// src/modules/auth/index.ts
import type { ActionResult } from '@baik/types';

import db from '../../db';

const tableName = 'baik-auth';

const verifySession = async (args: { sessionToken: string }): Promise<ActionResult> => {
  const { sessionToken } = args;

  const sessionParams = {
    tableName,
    indexName: 'GSI1',
    keyConditionExpression: 'GSI1PK = :gsi1pk AND GSI1SK = :gsi1sk',
    expressionAttributeValues: {
      ':gsi1pk': `SESSION#${sessionToken}`,
      ':gsi1sk': `SESSION#${sessionToken}`,
    },
  };

  const res = await db.queryItems(sessionParams);

  if (res.items?.length) return { data: { verified: true, item: res.items[0] }, message: 'Session is valid' };

  return { data: { verified: false }, message: 'Session is invalid' };
};

export default {
  verifySession: {
    skip_auth: true,
    run: verifySession,
  },
};
