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
];
