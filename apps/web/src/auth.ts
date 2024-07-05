import { DynamoDBAdapter } from '@auth/dynamodb-adapter';
import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const config: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: process.env.AUTH_DYNAMODB_ID as string,
    secretAccessKey: process.env.AUTH_DYNAMODB_SECRET as string,
  },
  region: process.env.AUTH_DYNAMODB_REGION,
};

const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: DynamoDBAdapter(client, { tableName: 'baik-auth' }),
  callbacks: {
    signIn({ user }) {
      return user.email === 'junhobaik@gmail.com';
    },
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
