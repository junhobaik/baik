// src/db.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  BatchGetCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

interface CreateItemArgs {
  tableName: string;
  item: Record<string, any>;
}

export const createItem = async (args: CreateItemArgs) => {
  const command = new PutCommand({
    TableName: args.tableName,
    Item: args.item,
  });

  try {
    return await docClient.send(command);
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

interface GetItemArgs {
  tableName: string;
  key: Record<string, any>;
}

export const getItem = async (args: GetItemArgs) => {
  const command = new GetCommand({
    TableName: args.tableName,
    Key: args.key,
  });

  try {
    const response = await docClient.send(command);
    return response.Item;
  } catch (error) {
    console.error('Error getting item:', error);
    throw error;
  }
};

interface UpdateItemArgs {
  tableName: string;
  key: Record<string, any>;
  updateExpression: string;
  expressionAttributeValues: Record<string, any>;
  expressionAttributeNames?: Record<string, string>;
}

export const updateItem = async (args: UpdateItemArgs) => {
  const command = new UpdateCommand({
    TableName: args.tableName,
    Key: args.key,
    UpdateExpression: args.updateExpression,
    ExpressionAttributeValues: args.expressionAttributeValues,
    ExpressionAttributeNames: args.expressionAttributeNames,
    ReturnValues: 'ALL_NEW',
  });

  try {
    const response = await docClient.send(command);
    return response.Attributes;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

interface DeleteItemArgs {
  tableName: string;
  key: Record<string, any>;
}

export const deleteItem = async (args: DeleteItemArgs) => {
  const command = new DeleteCommand({
    TableName: args.tableName,
    Key: args.key,
  });

  try {
    return await docClient.send(command);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

interface QueryItemsArgs {
  tableName: string;
  indexName?: string;
  keyConditionExpression: string;
  expressionAttributeValues: Record<string, any>;
  expressionAttributeNames?: Record<string, string>;
  filterExpression?: string;
  limit?: number;
  scanIndexForward?: boolean;
  exclusiveStartKey?: Record<string, any>;
}

export const queryItems = async (args: QueryItemsArgs) => {
  const command = new QueryCommand({
    TableName: args.tableName,
    IndexName: args.indexName,
    KeyConditionExpression: args.keyConditionExpression,
    ExpressionAttributeValues: args.expressionAttributeValues,
    ExpressionAttributeNames: args.expressionAttributeNames,
    FilterExpression: args.filterExpression,
    Limit: args.limit,
    ScanIndexForward: args.scanIndexForward,
    ExclusiveStartKey: args.exclusiveStartKey,
  });

  try {
    const response = await docClient.send(command);
    return {
      items: response.Items,
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error querying items:', error);
    throw error;
  }
};

interface ScanItemsArgs {
  tableName: string;
  indexName?: string;
  filterExpression?: string;
  expressionAttributeValues?: Record<string, any>;
  expressionAttributeNames?: Record<string, string>;
  limit?: number;
  exclusiveStartKey?: Record<string, any>;
}

export const scanItems = async (args: ScanItemsArgs) => {
  const command = new ScanCommand({
    TableName: args.tableName,
    IndexName: args.indexName,
    FilterExpression: args.filterExpression,
    ExpressionAttributeValues: args.expressionAttributeValues,
    ExpressionAttributeNames: args.expressionAttributeNames,
    Limit: args.limit,
    ExclusiveStartKey: args.exclusiveStartKey,
  });

  try {
    const response = await docClient.send(command);
    return {
      Items: response.Items,
      LastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error scanning items:', error);
    throw error;
  }
};

interface BatchGetItemsArgs {
  tableName: string;
  keys: Record<string, any>[];
}

export const batchGetItems = async (args: BatchGetItemsArgs) => {
  const command = new BatchGetCommand({
    RequestItems: {
      [args.tableName]: {
        Keys: args.keys,
      },
    },
  });

  try {
    const response = await docClient.send(command);
    return response.Responses?.[args.tableName];
  } catch (error) {
    console.error('Error batch getting items:', error);
    throw error;
  }
};

export default {
  createItem,
  getItem,
  updateItem,
  deleteItem,
  queryItems,
  scanItems,
  batchGetItems,
};
