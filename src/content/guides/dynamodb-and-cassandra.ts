import body from './dynamodb-and-cassandra.md?raw';
import type { Nugget } from '@/types';

export const dynamodbAndCassandra: Nugget = {
  id: 'dynamodb-and-cassandra',
  title: 'DynamoDB & Cassandra',
  summary:
    'Two wide-column stores that make you design around the partition key up front — what that buys you and what it forbids.',
  tags: ['databases', 'tooling'],
  section: 'data-stores',
  body,
  format: 'guide',
};
