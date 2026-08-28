import body from './serverless-aws-lambda.md?raw';
import type { Nugget } from '@/types';

export const serverlessAwsLambda: Nugget = {
  id: 'serverless-aws-lambda',
  title: 'Serverless & AWS Lambda',
  summary:
    'The function-as-a-service model: what you give up for no servers and scale-to-zero, and where cold starts hurt.',
  tags: ['apis', 'tooling', 'performance'],
  section: 'delivery',
  body,
  format: 'guide',
};
