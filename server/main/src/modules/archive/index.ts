// server/main/src/modules/archive/index.ts
import type {
  ActionResult,
  Article,
  ArticleBase,
  ClipArticle,
  DataTypes,
  PostArticle,
  ShortsArticle,
} from '@baik/types';
import { v4 as uuidv4 } from 'uuid';

import db from '../../db';

const tableName = 'baik-archive';

type CreateArticleArgs = ArticleBase & {
  pathname?: string;
  url?: string;
  origin_title?: string;
  site?: { title: string; link: string; favicon_url?: string; description?: string };
};

type UpdateArticleArgs = { id: string } & Partial<CreateArticleArgs>;

const createArticle = async (args: CreateArticleArgs): Promise<ActionResult> => {
  const now = Date.now();
  const id = uuidv4();

  const commonAttributes = {
    pk: `ARTICLE#${id}`,
    sk: `ARTICLE#${now}`,
    id,
    data_type: 'article' as DataTypes,
    created_at: now,
    updated_at: now,
    GSI1PK: 'ARTICLE',
    GSI1SK: `ARTICLE#${now}`,
    GSI2PK: 'ARTICLE',
    GSI2SK: `UPDATED#${now}#${id}`,
    GSI3PK: `TYPE#${args.type}#STATUS#${args.status}`,
    GSI3SK: `UPDATED#${now}#${id}`,
  };

  let newArticle: Article;

  if (args.type === 'clip') {
    newArticle = {
      ...commonAttributes,
      ...args,
      GSI4PK: 'ARTICLE',
      GSI4SK: `URL#${args.url}`,
    } as ClipArticle;
  } else {
    newArticle = {
      ...commonAttributes,
      ...args,
      GSI4PK: 'ARTICLE',
      GSI4SK: `PATHNAME#${args.pathname}`,
    } as PostArticle | ShortsArticle;
  }

  const params = {
    tableName,
    item: newArticle,
  };

  try {
    await db.createItem(params);
    return {
      data: { success: true, item: newArticle },
      message: 'Article created successfully',
    };
  } catch (error) {
    console.error('Error creating article:', error);
    return {
      message: 'Failed to create article',
      error: {
        code: 'ARCHIVE>ARTICLE>UNKNOWN_ERROR',
        message: error as string,
      },
    };
  }
};

const updateArticle = async (args: UpdateArticleArgs): Promise<ActionResult> => {
  const { id, ...updateData } = args;
  const now = Date.now();

  const queryParams = {
    tableName,
    keyConditionExpression: 'pk = :pkValue',
    expressionAttributeValues: {
      ':pkValue': `ARTICLE#${id}`,
    },
    limit: 1,
  };

  try {
    const queryResult = await db.queryItems(queryParams);

    if (!queryResult.items || queryResult.items.length === 0) {
      return {
        message: 'Article not found',
        error: {
          code: 'ARCHIVE>ARTICLE>NOT_FOUND',
          message: `Article with id ${id} not found`,
        },
      };
    }

    const item = queryResult.items[0];
    const sk = item.sk;

    let updateExpression = 'set updated_at = :updated_at';
    const expressionAttributeValues: Record<string, any> = {
      ':updated_at': now,
    };
    const expressionAttributeNames: Record<string, string> = {};

    Object.entries(updateData).forEach(([key, value]) => {
      updateExpression += `, #${key} = :${key}`;
      expressionAttributeValues[`:${key}`] = value;
      expressionAttributeNames[`#${key}`] = key;
    });

    // GSI 업데이트 처리
    if (updateData.type || updateData.status) {
      const newType = updateData.type || item.type;
      const newStatus = updateData.status || item.status;
      updateExpression += `, GSI3PK = :GSI3PK`;
      expressionAttributeValues[':GSI3PK'] = `TYPE#${newType}#STATUS#${newStatus}`;
    }

    updateExpression += `, GSI3SK = :GSI3SK, GSI2SK = :GSI2SK`;
    expressionAttributeValues[':GSI3SK'] = `UPDATED#${now}#${id}`;
    expressionAttributeValues[':GSI2SK'] = `UPDATED#${now}#${id}`;

    if (updateData.pathname) {
      updateExpression += `, GSI4SK = :GSI4SK`;
      expressionAttributeValues[':GSI4SK'] = `PATHNAME#${updateData.pathname}`;
    } else if (updateData.url) {
      updateExpression += `, GSI4SK = :GSI4SK`;
      expressionAttributeValues[':GSI4SK'] = `URL#${updateData.url}`;
    }

    const params = {
      tableName,
      key: {
        pk: `ARTICLE#${id}`,
        sk: sk,
      },
      updateExpression,
      expressionAttributeValues,
      expressionAttributeNames,
      returnValues: 'ALL_NEW',
    };

    const result = await db.updateItem(params);

    if (!result) {
      throw new Error('Failed to update article');
    }

    return {
      data: { item: result, success: true },
      message: 'Article updated successfully',
    };
  } catch (error) {
    return {
      message: 'Failed to update article',
      error: {
        code: 'ARCHIVE>ARTICLE>UPDATE_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const deleteArticle = async (args: { id: string }): Promise<ActionResult> => {
  const { id } = args;

  const pkValue = `ARTICLE#${id}`;

  try {
    const queryParams = {
      tableName,
      keyConditionExpression: 'pk = :pkValue',
      expressionAttributeValues: {
        ':pkValue': pkValue,
      },
      limit: 1,
    };

    const queryResult = await db.queryItems(queryParams);

    if (!queryResult.items || queryResult.items.length === 0) {
      return {
        message: 'Article not found',
        error: {
          code: 'ARCHIVE>ARTICLE>NOT_FOUND',
          message: `Article with id ${id} not found`,
        },
      };
    }

    const item = queryResult.items[0];

    const deleteParams = {
      tableName,
      key: {
        pk: pkValue,
        sk: item.sk,
      },
      conditionExpression: 'attribute_exists(pk)',
    };

    await db.deleteItem(deleteParams);

    return {
      message: 'Article deleted successfully',
      data: { id: id, success: true },
    };
  } catch (error) {
    console.error('Error deleting article:', error);

    if ((error as any).name === 'ConditionalCheckFailedException') {
      return {
        message: 'Article not found or already deleted',
        error: {
          code: 'ARCHIVE>ARTICLE>DELETE_FAILED',
          message: `Article with id ${id} not found or already deleted`,
        },
      };
    }

    return {
      message: 'Failed to delete article',
      error: {
        code: 'ARCHIVE>ARTICLE>DELETE_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const getArticle = async (args: { id: string }): Promise<ActionResult> => {
  const { id } = args;

  const queryParams = {
    tableName,
    keyConditionExpression: 'pk = :pkValue',
    expressionAttributeValues: {
      ':pkValue': `ARTICLE#${id}`,
    },
    limit: 1,
  };

  try {
    const queryResult = await db.queryItems(queryParams);

    if (!queryResult.items || queryResult.items.length === 0) {
      return {
        message: 'Article not found',
        error: {
          code: 'ARCHIVE>ARTICLE>NOT_FOUND',
          message: `Article with id ${id} not found`,
        },
      };
    }

    return {
      data: { item: queryResult.items[0], success: true },
      message: 'Article retrieved successfully',
    };
  } catch (error) {
    console.error('Error retrieving article:', error);
    return {
      message: 'Failed to retrieve article',
      error: {
        code: 'ARCHIVE>ARTICLE>RETRIEVE_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const getAllArticles = async (args: {
  orderBy?: 'created_at' | 'updated_date';
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const { orderBy = 'created_at', limit = 50, lastEvaluatedKey } = args;

  const sortKey = orderBy === 'created_at' ? 'GSI1SK' : 'GSI2SK';
  const params = {
    tableName,
    indexName: 'AllArticlesIndex',
    keyConditionExpression: 'GSI1PK = :gsi1pk',
    expressionAttributeValues: {
      ':gsi1pk': 'ARTICLE',
    },
    scanIndexForward: orderBy === 'created_at',
    limit,
    exclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const result = await db.queryItems(params);
    return {
      data: {
        success: true,
        items: result.items,
        lastEvaluatedKey: result.lastEvaluatedKey,
      },
      message: 'Articles retrieved successfully',
    };
  } catch (error) {
    console.error('Error retrieving articles:', error);
    return {
      message: 'Failed to retrieve articles',
      error: {
        code: 'ARCHIVE>ARTICLE>RETRIEVE_ALL_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const getArticlesByStatus = async (args: {
  status: string;
  orderBy?: 'created_at' | 'updated_date';
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const { status, orderBy = 'created_at', limit = 50, lastEvaluatedKey } = args;

  const params = {
    tableName,
    indexName: 'TypeStatusIndex',
    keyConditionExpression: 'GSI3PK = :gsi3pk',
    expressionAttributeValues: {
      ':gsi3pk': `TYPE#*#STATUS#${status}`,
    },
    scanIndexForward: orderBy === 'created_at',
    limit,
    exclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const result = await db.queryItems(params);
    return {
      data: {
        success: true,
        items: result.items,
        lastEvaluatedKey: result.lastEvaluatedKey,
      },
      message: 'Articles retrieved successfully',
    };
  } catch (error) {
    console.error('Error retrieving articles by status:', error);
    return {
      message: 'Failed to retrieve articles by status',
      error: {
        code: 'ARCHIVE>ARTICLE>RETRIEVE_BY_STATUS_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const getArticlesByType = async (args: {
  type: string;
  orderBy?: 'created_at' | 'updated_date';
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const { type, orderBy = 'created_at', limit = 50, lastEvaluatedKey } = args;

  const params = {
    tableName,
    indexName: 'TypeStatusIndex',
    keyConditionExpression: 'GSI3PK = :gsi3pk',
    expressionAttributeValues: {
      ':gsi3pk': `TYPE#${type}#STATUS#*`,
    },
    scanIndexForward: orderBy === 'created_at',
    limit,
    exclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const result = await db.queryItems(params);
    return {
      data: {
        success: true,
        items: result.items,
        lastEvaluatedKey: result.lastEvaluatedKey,
      },
      message: 'Articles retrieved successfully',
    };
  } catch (error) {
    console.error('Error retrieving articles by type:', error);
    return {
      message: 'Failed to retrieve articles by type',
      error: {
        code: 'ARCHIVE>ARTICLE>RETRIEVE_BY_TYPE_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const getArticlesByTypeStatus = async (args: {
  type: string;
  status: string;
  orderBy?: 'created_at' | 'updated_date';
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const { type, status, orderBy = 'created_at', limit = 50, lastEvaluatedKey } = args;

  const params = {
    tableName,
    indexName: 'TypeStatusIndex',
    keyConditionExpression: 'GSI3PK = :gsi3pk',
    expressionAttributeValues: {
      ':gsi3pk': `TYPE#${type}#STATUS#${status}`,
    },
    scanIndexForward: orderBy === 'created_at',
    limit,
    exclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const result = await db.queryItems(params);
    return {
      data: {
        success: true,
        items: result.items,
        lastEvaluatedKey: result.lastEvaluatedKey,
      },
      message: 'Articles retrieved successfully',
    };
  } catch (error) {
    console.error('Error retrieving articles by type and status:', error);
    return {
      message: 'Failed to retrieve articles by type and status',
      error: {
        code: 'ARCHIVE>ARTICLE>RETRIEVE_BY_TYPE_STATUS_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const getArticleByPathname = async (args: { pathname: string }): Promise<ActionResult> => {
  const { pathname } = args;

  const params = {
    tableName,
    indexName: 'PathnameIndex',
    keyConditionExpression: 'GSI4PK = :gsi4pk and GSI4SK = :gsi4sk',
    expressionAttributeValues: {
      ':gsi4pk': 'ARTICLE',
      ':gsi4sk': `PATHNAME#${pathname}`,
    },
    limit: 1,
  };

  try {
    const result = await db.queryItems(params);
    const item = result.items ? result.items[0] : null;

    return {
      data: {
        success: true,
        item: item,
      },
      message: 'Article retrieved successfully',
    };
  } catch (error) {
    console.error('Error retrieving article by pathname:', error);
    return {
      message: 'Failed to retrieve article by pathname',
      error: {
        code: 'ARCHIVE>ARTICLE>RETRIEVE_BY_PATHNAME_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const getAllArticlesPublic = async (args?: {
  orderBy?: 'created_at' | 'updated_date';
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const { orderBy = 'created_at', limit = 50, lastEvaluatedKey } = args || {};

  const sortKey = orderBy === 'created_at' ? 'GSI1SK' : 'GSI2SK';
  const params = {
    tableName,
    indexName: 'AllArticlesIndex',
    keyConditionExpression: 'GSI1PK = :gsi1pk',
    filterExpression: '#status = :status',
    expressionAttributeNames: {
      '#status': 'status',
    },
    expressionAttributeValues: {
      ':gsi1pk': 'ARTICLE',
      ':status': 'published',
    },
    limit,
    exclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const result = await db.queryItems(params);
    return {
      data: {
        success: true,
        items: result.items,
        lastEvaluatedKey: result.lastEvaluatedKey,
      },
      message: 'Articles retrieved successfully',
    };
  } catch (error) {
    console.error('Error retrieving all articles:', error);
    return {
      message: 'Failed to retrieve all articles',
      error: {
        code: 'ARCHIVE>ARTICLE>RETRIEVE_ALL_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const getArticleByPathnamePublic = async (args: { pathname: string }): Promise<ActionResult> => {
  const { pathname } = args;

  const params = {
    tableName,
    indexName: 'PathnameIndex',
    keyConditionExpression: 'GSI4PK = :gsi4pk and GSI4SK = :gsi4sk',
    filterExpression: '#status = :status',
    expressionAttributeNames: {
      '#status': 'status',
    },
    expressionAttributeValues: {
      ':gsi4pk': 'ARTICLE',
      ':gsi4sk': `PATHNAME#${pathname}`,
      ':status': 'published',
    },
    limit: 1,
  };

  try {
    const result = await db.queryItems(params);
    const item = result.items ? result.items[0] : null;

    return {
      data: {
        success: true,
        item: item,
      },
      message: 'Article retrieved successfully',
    };
  } catch (error) {
    console.error('Error retrieving articles by pathname:', error);
    return {
      message: 'Failed to retrieve article by pathname',
      error: {
        code: 'ARCHIVE>ARTICLE>RETRIEVE_BY_PATHNAME_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const deleteArticles = async ({ list }: { list: { pk: string; sk: string }[] }): Promise<ActionResult> => {
  if (list.length === 0) {
    return {
      message: 'No articles to delete',
      data: { success: true, deletedCount: 0 },
    };
  }

  try {
    const chunkSize = 25;
    const chunks = [];
    for (let i = 0; i < list.length; i += chunkSize) {
      chunks.push(list.slice(i, i + chunkSize));
    }

    let deletedCount = 0;
    let unprocessedItems: { pk: string; sk: string }[] = [];

    for (const chunk of chunks) {
      const deleteParams = {
        tableName,
        keys: chunk.map((item) => ({ pk: item.pk, sk: item.sk })),
      };

      const result = await db.batchDeleteItems(deleteParams);

      const currentUnprocessedItems = result.UnprocessedItems?.[tableName] || [];
      deletedCount += chunk.length - currentUnprocessedItems.length;

      unprocessedItems = unprocessedItems.concat(
        currentUnprocessedItems.map((item: any) => ({
          pk: item.DeleteRequest.Key.pk,
          sk: item.DeleteRequest.Key.sk,
        })),
      );
    }

    return {
      message: 'Articles deleted successfully',
      data: {
        success: true,
        deletedCount,
        unprocessedItems: unprocessedItems.length > 0 ? unprocessedItems : undefined,
      },
    };
  } catch (error) {
    console.error('Error deleting articles:', error);
    return {
      message: 'Failed to delete articles',
      error: {
        code: 'ARCHIVE>ARTICLE>BATCH_DELETE_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

export default {
  createArticle: {
    run: createArticle,
    skip_auth: false,
  },
  updateArticle: {
    run: updateArticle,
    skip_auth: false,
  },
  deleteArticle: {
    run: deleteArticle,
    skip_auth: false,
  },
  getArticle: {
    run: getArticle,
    skip_auth: false,
  },
  getAllArticles: {
    run: getAllArticles,
    skip_auth: false,
  },
  getArticlesByStatus: {
    run: getArticlesByStatus,
    skip_auth: false,
  },
  getArticlesByType: {
    run: getArticlesByType,
    skip_auth: false,
  },
  getArticlesByTypeStatus: {
    run: getArticlesByTypeStatus,
    skip_auth: false,
  },
  getArticleByPathname: {
    run: getArticleByPathname,
    skip_auth: false,
  },
  deleteArticles: {
    run: deleteArticles,
    skip_auth: false,
  },
  // public
  getArticleByPathnamePublic: {
    run: getArticleByPathnamePublic,
    skip_auth: true,
  },
  getAllArticlesPublic: {
    run: getAllArticlesPublic,
    skip_auth: true,
  },
};
