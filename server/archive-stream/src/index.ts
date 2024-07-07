// server/archive-stream/src/index.ts
import { type AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import algoliasearch from 'algoliasearch';
import { type Context, type DynamoDBStreamEvent } from 'aws-lambda';

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || '';
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY || '';
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME || '';

const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const algoliaIndex = algoliaClient.initIndex(ALGOLIA_INDEX_NAME);

export const handler = async (event: DynamoDBStreamEvent, context: Context): Promise<void> => {
  try {
    for (const record of event.Records) {
      if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
        if (record.dynamodb && record.dynamodb.NewImage) {
          const newItem = unmarshall(record.dynamodb.NewImage as Record<string, AttributeValue>);
          await algoliaIndex.saveObject({
            objectID: newItem.id,
            ...newItem,
          });
        }
      } else if (record.eventName === 'REMOVE') {
        if (record.dynamodb && record.dynamodb.OldImage) {
          const deletedItem = unmarshall(record.dynamodb.OldImage as Record<string, AttributeValue>);
          if (deletedItem.id) {
            await algoliaIndex.deleteObject(deletedItem.id);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error processing DynamoDB stream:', error);
    throw error;
  }
};
