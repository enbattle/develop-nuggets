import type { Nugget } from '@/types';
import { apiBestPractices } from './api-best-practices';
import { dockerGettingStarted } from './docker-getting-started';
import { apisRestVsGraphqlVsGrpc } from './apis-rest-vs-graphql-vs-grpc';
import { networkingProtocols } from './networking-protocols';
import { networkingLoadBalancing } from './networking-load-balancing';
import { networkingRealTimeCommunication } from './networking-real-time-communication';
import { dataModeling } from './data-modeling';
import { cdn } from './cdn';
import { redis } from './redis';
import { kafka } from './kafka';
import { elasticsearch } from './elasticsearch';
import { relationalDatabases } from './relational-databases';
import { dynamodbAndCassandra } from './dynamodb-and-cassandra';
import { apiGateway } from './api-gateway';
import { blobStorage } from './blob-storage';
import { serverlessAwsLambda } from './serverless-aws-lambda';
import { oauth } from './oauth';

// AI Engineering guides (migrated from ai-cauldron). Each section keeps its
// own ordered array under ./ai/<section>/index.ts; they're spread into
// GUIDES below and grouped for display by `section` like everything else.
import { AI_LLM_INTERNALS } from './ai/llm-internals';
import { AI_REASONING } from './ai/reasoning';
import { AI_ADAPTATION } from './ai/adaptation';
import { AI_RETRIEVAL } from './ai/retrieval';
import { AI_AGENTS } from './ai/agents';
import { AI_ORCHESTRATION } from './ai/orchestration';
import { AI_SAFETY } from './ai/safety';
import { AI_EVALUATION } from './ai/evaluation';
import { AI_MLOPS } from './ai/mlops';

/** Add a new guide's import here — see CLAUDE.md "Adding a guide". */
export const GUIDES: Nugget[] = [
  apiBestPractices,
  dockerGettingStarted,
  apisRestVsGraphqlVsGrpc,
  networkingProtocols,
  networkingLoadBalancing,
  networkingRealTimeCommunication,
  dataModeling,
  cdn,
  redis,
  kafka,
  elasticsearch,
  relationalDatabases,
  dynamodbAndCassandra,
  apiGateway,
  blobStorage,
  serverlessAwsLambda,
  oauth,
  ...AI_LLM_INTERNALS,
  ...AI_REASONING,
  ...AI_ADAPTATION,
  ...AI_RETRIEVAL,
  ...AI_AGENTS,
  ...AI_ORCHESTRATION,
  ...AI_SAFETY,
  ...AI_EVALUATION,
  ...AI_MLOPS,
];
