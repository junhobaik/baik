// server/main/src/modules/dashboard/index.ts
import type { ActionResult, BookmarkGroup, BookmarkGroupBase, DataTypes } from '@baik/types';
import { v4 as uuidv4 } from 'uuid';

import db from '../../db';

const tableName = 'baik-dashboard';

const createBookmarkGroup = async (args: BookmarkGroupBase): Promise<ActionResult> => {
  const now = Date.now();
  const newBookmarkGroup: BookmarkGroup = {
    ...args,
    id: uuidv4(),
    data_type: 'bookmarkGroup',
    created_at: now,
    updated_at: now,
  };

  const params = {
    tableName,
    item: {
      pk: `BOOKMARKGROUP#${newBookmarkGroup.id}`,
      sk: `BOOKMARKGROUP#${newBookmarkGroup.created_at}#${newBookmarkGroup.id}`,
      ...newBookmarkGroup,
    },
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

  console.log('Updating bookmark group with id:', id);
  console.log('Update data:', updateData);

  const queryParams = {
    tableName,
    keyConditionExpression: 'pk = :pkValue',
    expressionAttributeValues: {
      ':pkValue': `BOOKMARKGROUP#${id}`,
    },
    limit: 1,
  };

  try {
    console.log('Querying for existing bookmark group');
    const queryResult = await db.queryItems(queryParams);
    console.log('Query result:', queryResult);

    if (!queryResult.items || queryResult.items.length === 0) {
      console.log('Bookmark group not found');
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

    console.log('Update expression:', updateExpression);
    console.log('Expression attribute values:', expressionAttributeValues);
    console.log('Expression attribute names:', expressionAttributeNames);

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

    console.log('Updating item with params:', params);
    const result = await db.updateItem(params);
    console.log('Update result:', result);

    if (!result) {
      console.log('Failed to update bookmark group: No result returned');
      throw new Error('Failed to update bookmark group');
    }

    return {
      data: { item: result },
      message: 'Bookmark group updated successfully',
    };
  } catch (error) {
    console.error('Error updating bookmark group:', error);
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
  console.log('getAllBookmarkGroups args:', args);
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

export default {
  createBookmarkGroup: {
    run: createBookmarkGroup,
    skipAuth: false,
  },
  updateBookmarkGroup: {
    run: updateBookmarkGroup,
    skipAuth: false,
  },
  deleteBookmarkGroup: {
    run: deleteBookmarkGroup,
    skipAuth: false,
  },
  getBookmarkGroup: {
    run: getBookmarkGroup,
    skipAuth: false,
  },
  getAllBookmarkGroups: {
    run: getAllBookmarkGroups,
    skipAuth: false,
  },
};
