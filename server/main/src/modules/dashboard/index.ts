// server/main/src/modules/dashboard/index.ts
import type {
  ActionResult,
  BookmarkGroup,
  BookmarkGroupBase,
  CrawlerFeedItem,
  DataTypes,
  FeedItem,
  FeedItemBase,
  RSSFeedItem,
} from '@baik/types';
import { v4 as uuidv4 } from 'uuid';

import db from '../../db';

const tableName = 'baik-dashboard';

const createBookmarkGroup = async (args: BookmarkGroupBase): Promise<ActionResult> => {
  const now = Date.now();
  const id = uuidv4();

  const newBookmarkGroup: BookmarkGroup = {
    ...args,
    pk: `BOOKMARKGROUP#${id}`,
    sk: `BOOKMARKGROUP#${now}#${id}`,
    id: id,
    data_type: 'bookmarkGroup',
    created_at: now,
    updated_at: now,
  };

  const params = {
    tableName,
    item: newBookmarkGroup,
  };

  try {
    await db.createItem(params);
    return {
      data: { success: true, item: newBookmarkGroup },
      message: 'Bookmark group created successfully',
    };
  } catch (error) {
    console.error('Error creating bookmark group:', error);
    return {
      message: 'Failed to create bookmark group',
      error: {
        code: 'DASHBOARD>BOOKMARK_GROUP>UNKNOWN_ERROR',
        message: error as string,
      },
    };
  }
};

const updateBookmarkGroup = async (args: { id: string } & Partial<BookmarkGroupBase>): Promise<ActionResult> => {
  const { id, ...updateData } = args;
  const now = Date.now();

  const queryParams = {
    tableName,
    keyConditionExpression: 'pk = :pkValue',
    expressionAttributeValues: {
      ':pkValue': `BOOKMARKGROUP#${id}`,
    },
    limit: 1,
  };

  try {
    const queryResult = await db.queryItems(queryParams);

    if (!queryResult.items || queryResult.items.length === 0) {
      return {
        message: 'Bookmark group not found',
        error: {
          code: 'DASHBOARD>BOOKMARK_GROUP>NOT_FOUND',
          message: `Bookmark group with id ${id} not found`,
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

    const params = {
      tableName,
      key: {
        pk: `BOOKMARKGROUP#${id}`,
        sk: sk,
      },
      updateExpression,
      expressionAttributeValues,
      expressionAttributeNames,
      returnValues: 'ALL_NEW',
    };

    const result = await db.updateItem(params);

    if (!result) {
      throw new Error('Failed to update bookmark group');
    }

    return {
      data: { item: result },
      message: 'Bookmark group updated successfully',
    };
  } catch (error) {
    return {
      message: 'Failed to update bookmark group',
      error: {
        code: 'DASHBOARD>BOOKMARK_GROUP>UPDATE_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const deleteBookmarkGroup = async (args: { id: string }): Promise<ActionResult> => {
  const { id } = args;

  const pkValue = `BOOKMARKGROUP#${id}`;

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
        message: 'Bookmark group not found',
        error: {
          code: 'DASHBOARD>BOOKMARK_GROUP>NOT_FOUND',
          message: `Bookmark group with id ${id} not found`,
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
      message: 'Bookmark group deleted successfully',
      data: { id: id },
    };
  } catch (error) {
    console.error('Error deleting bookmark group:', error);

    if ((error as any).name === 'ConditionalCheckFailedException') {
      return {
        message: 'Bookmark group not found or already deleted',
        error: {
          code: 'DASHBOARD>BOOKMARK_GROUP>DELETE_FAILED',
          message: `Bookmark group with id ${id} not found or already deleted`,
        },
      };
    }

    return {
      message: 'Failed to delete bookmark group',
      error: {
        code: 'DASHBOARD>BOOKMARK_GROUP>DELETE_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const getBookmarkGroup = async (args: { id: string }): Promise<ActionResult> => {
  const { id } = args;

  const queryParams = {
    tableName,
    keyConditionExpression: 'pk = :pkValue',
    expressionAttributeValues: {
      ':pkValue': `BOOKMARKGROUP#${id}`,
    },
    limit: 1,
  };

  try {
    const queryResult = await db.queryItems(queryParams);

    if (!queryResult.items || queryResult.items.length === 0) {
      return {
        message: 'Bookmark group not found',
        error: {
          code: 'DASHBOARD>BOOKMARK_GROUP>NOT_FOUND',
          message: `Bookmark group with id ${id} not found`,
        },
      };
    }

    return {
      data: { item: queryResult.items[0] },
      message: 'Bookmark group retrieved successfully',
    };
  } catch (error) {
    console.error('Error retrieving bookmark group:', error);
    return {
      message: 'Failed to retrieve bookmark group',
      error: {
        code: 'DASHBOARD>BOOKMARK_GROUP>RETRIEVE_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const getAllBookmarkGroups = async (args: {
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const { limit = 50, lastEvaluatedKey } = args;

  const params = {
    tableName,
    indexName: 'DataTypeCreatedAtIndex',
    keyConditionExpression: 'data_type = :dataType',
    expressionAttributeValues: {
      ':dataType': 'bookmarkGroup',
    },
    scanIndexForward: false,
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
      message: 'Bookmark groups retrieved successfully',
    };
  } catch (error) {
    console.error('Error retrieving bookmark groups:', error);
    return {
      message: 'Failed to retrieve bookmark groups',
      error: {
        code: 'DASHBOARD>BOOKMARK_GROUP>RETRIEVE_ALL_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const createFeedItem = async (args: FeedItemBase): Promise<ActionResult> => {
  const now = Date.now();
  const id = uuidv4();

  const commonAttributes = {
    pk: `FEEDITEM#${id}`,
    sk: `FEEDITEM#${now}`,
    id,
    data_type: 'feed' as DataTypes,
    created_at: now,
    updated_at: now,
  };

  let newFeedItem: FeedItem;

  if (args.type === 'crawler') {
    newFeedItem = {
      ...commonAttributes,
      ...args,
      selector: args.selector,
    } as CrawlerFeedItem;
  } else {
    newFeedItem = {
      ...commonAttributes,
      ...args,
    } as RSSFeedItem;
  }

  const params = {
    tableName,
    item: newFeedItem,
  };

  try {
    await db.createItem(params);
    return {
      data: { success: true, item: newFeedItem },
      message: 'Feed item created successfully',
    };
  } catch (error) {
    console.error('Error creating feed item:', error);
    return {
      message: 'Failed to create feed item',
      error: {
        code: 'DASHBOARD>FEED_ITEM>UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const updateFeedItem = async (args: { id: string } & Partial<FeedItemBase>): Promise<ActionResult> => {
  const { id, ...updateData } = args;
  const now = Date.now();

  const getItemParams = {
    tableName,
    key: { id },
  };

  try {
    const existingItem = await db.getItem(getItemParams);

    if (!existingItem) {
      return {
        message: 'Feed item not found',
        error: {
          code: 'DASHBOARD>FEED_ITEM>NOT_FOUND',
          message: `Feed item with id ${id} not found`,
        },
      };
    }

    let updateExpression = 'set updated_at = :updated_at';
    const expressionAttributeValues: Record<string, any> = {
      ':updated_at': now,
    };
    const expressionAttributeNames: Record<string, string> = {};

    Object.entries(updateData).forEach(([key, value]) => {
      if (key === 'data') {
        Object.entries(value as Record<string, any>).forEach(([dataKey, dataValue]) => {
          updateExpression += `, #data.#${dataKey} = :${dataKey}`;
          expressionAttributeValues[`:${dataKey}`] = dataValue;
          expressionAttributeNames[`#${dataKey}`] = dataKey;
        });
        expressionAttributeNames['#data'] = 'data';
      } else if (key === 'selector' && (existingItem.type === 'crawler' || updateData.type === 'crawler')) {
        updateExpression += ', #selector = :selector';
        expressionAttributeValues[':selector'] = value;
        expressionAttributeNames['#selector'] = 'selector';
      } else {
        updateExpression += `, #${key} = :${key}`;
        expressionAttributeValues[`:${key}`] = value;
        expressionAttributeNames[`#${key}`] = key;
      }
    });

    const updateParams = {
      tableName,
      key: { id },
      updateExpression,
      expressionAttributeValues,
      expressionAttributeNames,
      returnValues: 'ALL_NEW',
    };

    const result = await db.updateItem(updateParams);

    if (!result) {
      throw new Error('Failed to update feed item');
    }

    return {
      data: { item: result },
      message: 'Feed item updated successfully',
    };
  } catch (error) {
    console.error('Error updating feed item:', error);
    return {
      message: 'Failed to update feed item',
      error: {
        code: 'DASHBOARD>FEED_ITEM>UPDATE_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const deleteFeedItem = async (args: { id: string }): Promise<ActionResult> => {
  const { id } = args;

  const pkValue = `FEEDITEM#${id}`;

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
        message: 'Feed item not found',
        error: {
          code: 'DASHBOARD>FEED_ITEM>NOT_FOUND',
          message: `Feed item with id ${id} not found`,
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
      message: 'Feed item deleted successfully',
      data: { id: id },
    };
  } catch (error) {
    console.error('Error deleting feed item:', error);

    if ((error as any).name === 'ConditionalCheckFailedException') {
      return {
        message: 'Feed item not found or already deleted',
        error: {
          code: 'DASHBOARD>FEED_ITEM>DELETE_FAILED',
          message: `Feed item with id ${id} not found or already deleted`,
        },
      };
    }

    return {
      message: 'Failed to delete feed item',
      error: {
        code: 'DASHBOARD>FEED_ITEM>DELETE_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const getFeedItem = async (args: { id: string }): Promise<ActionResult> => {
  const { id } = args;

  const queryParams = {
    tableName,
    keyConditionExpression: 'pk = :pkValue',
    expressionAttributeValues: {
      ':pkValue': `FEEDITEM#${id}`,
    },
    limit: 1,
  };

  try {
    const queryResult = await db.queryItems(queryParams);

    if (!queryResult.items || queryResult.items.length === 0) {
      return {
        message: 'Feed item not found',
        error: {
          code: 'DASHBOARD>FEED_ITEM>NOT_FOUND',
          message: `Feed item with id ${id} not found`,
        },
      };
    }

    return {
      data: { item: queryResult.items[0] },
      message: 'Feed item retrieved successfully',
    };
  } catch (error) {
    console.error('Error retrieving feed item:', error);
    return {
      message: 'Failed to retrieve feed item',
      error: {
        code: 'DASHBOARD>FEED_ITEM>RETRIEVE_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const getAllFeedItems = async (args: {
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const { limit = 50, lastEvaluatedKey } = args;

  const params = {
    tableName,
    indexName: 'DataTypeCreatedAtIndex',
    keyConditionExpression: 'data_type = :dataType',
    expressionAttributeValues: {
      ':dataType': 'feedItem',
    },
    scanIndexForward: false,
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
      message: 'Feed items retrieved successfully',
    };
  } catch (error) {
    console.error('Error retrieving feed items:', error);
    return {
      message: 'Failed to retrieve feed items',
      error: {
        code: 'DASHBOARD>FEED_ITEM>RETRIEVE_ALL_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

export default {
  createBookmarkGroup: {
    run: createBookmarkGroup,
    skip_auth: false,
  },
  updateBookmarkGroup: {
    run: updateBookmarkGroup,
    skip_auth: false,
  },
  deleteBookmarkGroup: {
    run: deleteBookmarkGroup,
    skip_auth: false,
  },
  getBookmarkGroup: {
    run: getBookmarkGroup,
    skip_auth: false,
  },
  getAllBookmarkGroups: {
    run: getAllBookmarkGroups,
    skip_auth: false,
  },
  createFeedItem: {
    run: createFeedItem,
    skip_auth: false,
  },
  updateFeedItem: {
    run: updateFeedItem,
    skip_auth: false,
  },
  deleteFeedItem: {
    run: deleteFeedItem,
    skip_auth: false,
  },
  getFeedItem: {
    run: getFeedItem,
    skip_auth: false,
  },
  getAllFeedItems: {
    run: getAllFeedItems,
    skip_auth: false,
  },
};
