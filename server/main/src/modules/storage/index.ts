import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

import db from '../../db';

export type ActionResult = {
  data?: Record<string, any>;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
};

const s3Client = new S3Client({ region: 'ap-northeast-2' });
const BUCKET_NAME = 'baik-image-bucket';
const CLOUDFRONT_DOMAIN = 'https://d25sqaee97ji3k.cloudfront.net';

const getContentType = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
};

const uploadImage = async (payload: { file: string; filename: string }): Promise<ActionResult> => {
  const { file, filename } = payload;
  const contentType = getContentType(filename);
  const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const id = uuidv4();
  const extension = filename.split('.').pop()?.toLowerCase();
  const key = `${id}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  const now = Date.now();

  try {
    await s3Client.send(command);

    await db.createItem({
      tableName: 'baik-storage',
      item: {
        pk: `STORAGE#${key}`,
        sk: `IMAGE#${now}`,
        id,
        bucket: BUCKET_NAME,
        type: 'image',
        url: `${CLOUDFRONT_DOMAIN}/${key}`,
        filename: key,
        created_at: now,
        updated_at: now,
      },
    });

    return {
      data: { item: `${CLOUDFRONT_DOMAIN}/${key}`, success: true },
      message: 'Image uploaded successfully',
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      error: {
        code: 'UPLOAD_FAILED',
        message: (error as Error).message || 'Failed to upload image',
      },
    };
  }
};

const updateImage = async (payload: { file: string; filename: string; oldKey: string }): Promise<ActionResult> => {
  const { file, filename, oldKey } = payload;

  // Delete the old image
  const deleteResult = await deleteImage({ key: oldKey });
  if (deleteResult.error) {
    return deleteResult;
  }

  // Upload the new image
  return uploadImage({ file, filename });
};

const deleteImage = async (payload: { key: string }): Promise<ActionResult> => {
  const { key } = payload;

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    await s3Client.send(command);

    const pkValue = `STORAGE#${key}`;

    const queryResult = await db.queryItems({
      tableName: 'baik-storage',
      keyConditionExpression: 'pk = :pkValue',
      expressionAttributeValues: {
        ':pkValue': pkValue,
      },
      limit: 1,
    });

    if (!queryResult.items || queryResult.items.length === 0) {
      return {
        message: 'Article not found',
        error: {
          code: 'STORAGE>IMAGE>DELETE_FAILED',
          message: 'Failed to delete image, not found in database',
        },
      };
    }

    const item = queryResult.items[0];

    const deleteParams = {
      tableName: 'baik-storage',
      key: {
        pk: pkValue,
        sk: item.sk,
      },
      conditionExpression: 'attribute_exists(pk)',
    };

    await db.deleteItem(deleteParams);

    return {
      data: { success: true },
      message: 'Image deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      error: {
        code: 'DELETE_FAILED',
        message: (error as Error).message || 'Failed to delete image',
      },
    };
  }
};

export default {
  uploadImage: {
    run: uploadImage,
    skip_auth: false,
  },
  updateImage: {
    run: updateImage,
    skip_auth: false,
  },
  deleteImage: {
    run: deleteImage,
    skip_auth: false,
  },
};
