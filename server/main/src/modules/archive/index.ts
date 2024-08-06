// server/main/src/modules/archive/index.ts
import type { ActionResult, Article, ArticleBase } from '@baik/types';
import { v4 as uuidv4 } from 'uuid';

import db from '../../db';

const tableName = 'baik-archive';

type CreateArticleArgs = ArticleBase & {
  pathname?: string;
  url?: string;
  origin_title?: string;
  site?: { title: string; link: string; favicon_url?: string; description?: string };
};

type UpdateArticleArgs = { id: string } & Partial<Omit<Article, 'pk'>>;

const createArticle = async (args: CreateArticleArgs): Promise<ActionResult> => {
  const id = uuidv4();
  const now = Date.now();
  const gsi1pk = `${args.type}/${args.status}`;
  const item = {
    pk: `ARTICLE#${id}`,
    id,
    ...args,
    data_type: 'article',
    GSI1PK: gsi1pk,
    created_at: now,
    updated_at: now,
  };

  try {
    await db.createItem({ tableName, item });
    return {
      data: { item, success: true },
      message: 'Article created successfully',
    };
  } catch (error) {
    console.error('Error creating article:', error);
    return {
      error: {
        code: 'CREATE_FAILED',
        message: (error as Error).message || 'Failed to create article',
      },
    };
  }
};

const updateArticle = async (args: UpdateArticleArgs): Promise<ActionResult> => {
  const { id, ...updateData } = args;
  const now = Date.now();

  let existingItem;
  try {
    const result = await db.queryItems({
      tableName,
      keyConditionExpression: 'pk = :pk',
      expressionAttributeValues: { ':pk': `ARTICLE#${id}` },
      limit: 1,
    });
    existingItem = result.items ? result.items[0] : null;

    if (!existingItem) {
      return {
        error: {
          code: 'NOT_FOUND',
          message: 'Article not found',
        },
      };
    }
  } catch (error) {
    console.error('Error fetching existing article:', error);
    return {
      error: {
        code: 'FETCH_FAILED',
        message: (error as Error).message || 'Failed to fetch existing article',
      },
    };
  }

  if (updateData.GSI1PK) delete updateData.GSI1PK;

  let updateExpression =
    'set ' +
    Object.keys(updateData)
      .map((key) => `#${key} = :${key}`)
      .join(', ') +
    ', updated_at = :updated_at';
  const expressionAttributeNames = Object.keys(updateData).reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {});
  const expressionAttributeValues: Record<string, any> = {
    ...Object.keys(updateData).reduce((acc, key) => ({ ...acc, [`:${key}`]: (updateData as any)[key] }), {}),
    ':updated_at': now,
  };

  if (
    (updateData.status && updateData.status !== existingItem.status) ||
    (updateData.type && updateData.type !== existingItem.type)
  ) {
    const newGsi1pk = `${updateData.type || existingItem.type}/${updateData.status || existingItem.status}`;
    updateExpression += ', GSI1PK = :GSI1PK';
    expressionAttributeValues[':GSI1PK'] = newGsi1pk;
  }

  try {
    const updatedItem = await db.updateItem({
      tableName,
      key: { pk: `ARTICLE#${id}`, created_at: existingItem.created_at },
      updateExpression,
      expressionAttributeNames,
      expressionAttributeValues,
    });

    return {
      data: { item: updatedItem, success: true },
      message: 'Article updated successfully',
    };
  } catch (error) {
    console.error('Error updating article:', error);
    return {
      error: {
        code: 'UPDATE_FAILED',
        message: (error as Error).message || 'Failed to update article',
      },
    };
  }
};

const deleteArticle = async (args: { id: string }): Promise<ActionResult> => {
  const { id } = args;

  try {
    const queryResult = await db.queryItems({
      tableName,
      keyConditionExpression: 'pk = :pk',
      expressionAttributeValues: { ':pk': `ARTICLE#${id}` },
      limit: 1,
    });

    const article = queryResult.items ? queryResult.items[0] : null;

    if (!article) {
      return {
        error: {
          code: 'NOT_FOUND',
          message: 'Article not found',
        },
      };
    }

    await db.deleteItem({
      tableName,
      key: { pk: `ARTICLE#${id}`, created_at: article.created_at },
    });

    return {
      data: { success: true },
      message: 'Article deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting article:', error);
    return {
      error: {
        code: 'DELETE_FAILED',
        message: (error as Error).message || 'Failed to delete article',
      },
    };
  }
};

const getArticle = async (args: { id: string }): Promise<ActionResult> => {
  const { id } = args;

  try {
    const queryResult = await db.queryItems({
      tableName,
      keyConditionExpression: 'pk = :pk',
      expressionAttributeValues: { ':pk': `ARTICLE#${id}` },
      limit: 1,
    });

    const item = queryResult.items ? queryResult.items[0] : null;

    if (!item) {
      return {
        error: {
          code: 'NOT_FOUND',
          message: 'Article not found',
        },
      };
    }

    return {
      data: { item, success: true },
      message: 'Article retrieved successfully',
    };
  } catch (error) {
    console.error('Error getting article:', error);
    return {
      error: {
        code: 'GET_FAILED',
        message: (error as Error).message || 'Failed to get article',
      },
    };
  }
};

const getAllArticles = async (args: {
  orderBy?: 'created_at' | 'updated_date';
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
  sortOrder?: 'asc' | 'desc';
}): Promise<ActionResult> => {
  const { orderBy = 'created_at', limit, lastEvaluatedKey, sortOrder = 'desc' } = args;
  const indexName = orderBy === 'updated_date' ? 'ArticleUpdateDateIndex' : undefined;
  const scanIndexForward = sortOrder === 'asc';

  try {
    const result = await db.queryItems({
      tableName,
      indexName,
      keyConditionExpression: 'data_type = :dataType',
      expressionAttributeValues: { ':dataType': 'article' },
      limit,
      scanIndexForward,
      exclusiveStartKey: lastEvaluatedKey,
    });

    return {
      data: { items: result.items || [], lastEvaluatedKey: result.lastEvaluatedKey, success: true },
      message: 'Articles retrieved successfully',
    };
  } catch (error) {
    console.error('Error getting all articles:', error);
    return {
      error: {
        code: 'GET_ALL_FAILED',
        message: (error as Error).message || 'Failed to get all articles',
      },
    };
  }
};

const getArticlesByStatus = async (args: {
  status: string;
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const { status, limit, lastEvaluatedKey } = args;

  try {
    const result = await db.queryItems({
      tableName,
      indexName: 'StatusUpdateDateIndex',
      keyConditionExpression: '#status = :status',
      expressionAttributeValues: { ':status': status },
      expressionAttributeNames: { '#status': 'status' },
      limit,
      scanIndexForward: false,
      exclusiveStartKey: lastEvaluatedKey,
    });

    return {
      data: { items: result.items || [], lastEvaluatedKey: result.lastEvaluatedKey, success: true },
      message: 'Articles retrieved successfully',
    };
  } catch (error) {
    console.error('Error getting articles by status:', error);
    return {
      error: {
        code: 'GET_BY_STATUS_FAILED',
        message: (error as Error).message || 'Failed to get articles by status',
      },
    };
  }
};

const getArticlesByTypeStatus = async (args: {
  type: string;
  status: string;
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const { type, status, limit, lastEvaluatedKey } = args;
  const key = `${type}/${status}`;

  try {
    const result = await db.queryItems({
      tableName,
      indexName: 'TypeStatusUpdatedDateIndex',
      keyConditionExpression: 'GSI1PK = :key',
      expressionAttributeValues: { ':key': key },
      limit,
      scanIndexForward: false,
      exclusiveStartKey: lastEvaluatedKey,
    });

    return {
      data: { items: result.items || [], lastEvaluatedKey: result.lastEvaluatedKey, success: true },
      message: 'Articles retrieved successfully',
    };
  } catch (error) {
    console.error('Error getting articles by type and status:', error);
    return {
      error: {
        code: 'GET_BY_TYPE_STATUS_FAILED',
        message: (error as Error).message || 'Failed to get articles by type and status',
      },
    };
  }
};

const getArticleByPathname = async (args: { pathname: string }): Promise<ActionResult> => {
  const { pathname } = args;

  try {
    const result = await db.queryItems({
      tableName,
      indexName: 'PathnameIndex',
      keyConditionExpression: 'pathname = :pathname',
      expressionAttributeValues: { ':pathname': pathname },
      limit: 1,
    });

    const item = result.items ? result.items[0] : null;
    if (!item) {
      return {
        error: {
          code: 'NOT_FOUND',
          message: 'Article not found',
        },
      };
    }

    return {
      data: { item, success: true },
      message: 'Article retrieved successfully',
    };
  } catch (error) {
    console.error('Error getting article by pathname:', error);
    return {
      error: {
        code: 'GET_BY_PATHNAME_FAILED',
        message: (error as Error).message || 'Failed to get article by pathname',
      },
    };
  }
};

const getAllPublishedArticles = async (args?: {
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
  sortOrder?: 'asc' | 'desc';
}): Promise<ActionResult> => {
  const { limit, lastEvaluatedKey, sortOrder = 'desc' } = args || {};
  const scanIndexForward = sortOrder === 'asc';

  try {
    const result = await db.queryItems({
      tableName,
      indexName: 'StatusUpdateDateIndex',
      keyConditionExpression: '#status = :status',
      expressionAttributeValues: { ':status': 'published' },
      expressionAttributeNames: { '#status': 'status' },
      limit,
      scanIndexForward,
      exclusiveStartKey: lastEvaluatedKey,
    });

    return {
      data: { items: result.items || [], lastEvaluatedKey: result.lastEvaluatedKey, success: true },
      message: 'Published articles retrieved successfully',
    };
  } catch (error) {
    console.error('Error getting all published articles:', error);
    return {
      error: {
        code: 'GET_ALL_PUBLISHED_FAILED',
        message: (error as Error).message || 'Failed to get all published articles',
      },
    };
  }
};

const getPublishedArticleByPathname = async (args: { pathname: string }): Promise<ActionResult> => {
  const { pathname } = args;

  try {
    const result = await db.queryItems({
      tableName,
      indexName: 'PathnameIndex',
      keyConditionExpression: 'pathname = :pathname',
      expressionAttributeValues: { ':pathname': pathname, ':status': 'published' },
      filterExpression: '#status = :status',
      expressionAttributeNames: { '#status': 'status' },
      limit: 1,
    });

    const item = result.items ? result.items[0] : null;
    if (!item) {
      return {
        error: {
          code: 'NOT_FOUND',
          message: 'Published article not found',
        },
      };
    }

    return {
      data: { item, success: true },
      message: 'Published article retrieved successfully',
    };
  } catch (error) {
    console.error('Error getting published article by pathname:', error);
    return {
      error: {
        code: 'GET_PUBLISHED_BY_PATHNAME_FAILED',
        message: (error as Error).message || 'Failed to get published article by pathname',
      },
    };
  }
};

const deleteArticles = async ({ list }: { list: { pk: string; created_at: number }[] }): Promise<ActionResult> => {
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
    let unprocessedItems: { pk: string; created_at: number }[] = [];

    for (const chunk of chunks) {
      const deleteParams = {
        tableName,
        keys: chunk.map((item) => ({ pk: item.pk, created_at: item.created_at })),
      };

      const result = await db.batchDeleteItems(deleteParams);

      const currentUnprocessedItems = result.UnprocessedItems?.[tableName] || [];
      deletedCount += chunk.length - currentUnprocessedItems.length;

      unprocessedItems = unprocessedItems.concat(
        currentUnprocessedItems.map((item: any) => ({
          pk: item.DeleteRequest.Key.pk,
          created_at: item.DeleteRequest.Key.created_at,
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
  deleteArticles: {
    run: deleteArticles,
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
  getArticlesByTypeStatus: {
    run: getArticlesByTypeStatus,
    skip_auth: false,
  },
  getArticleByPathname: {
    run: getArticleByPathname,
    skip_auth: false,
  },
  getAllPublishedArticles: {
    run: getAllPublishedArticles,
    skip_auth: true,
  },
  getPublishedArticleByPathname: {
    run: getPublishedArticleByPathname,
    skip_auth: true,
  },
};
