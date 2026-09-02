import type { Nugget } from '@/types';
import { whatIsRag } from './what-is-rag';
import { ragPipeline } from './rag-pipeline';
import { vectorDatabases } from './vector-databases';
import { chunkingStrategies } from './chunking-strategies';
import { buildingFirstRag } from './building-first-rag';
import { naiveVsProduction } from './naive-vs-production';
import { improvementsAndAdvanced } from './improvements-and-advanced';
import { commonIssues } from './common-issues';
import { evaluationMetrics } from './evaluation-metrics';
import { ragToolsAndFrameworks } from './rag-tools-and-frameworks';
import { lateChunking } from './late-chunking';
import { multiVectorRetrieval } from './multi-vector-retrieval';
import { ragFusion } from './rag-fusion';
import { contextualCompression } from './contextual-compression';
import { semanticCaching } from './semantic-caching';
import { openKnowledgeFormat } from './open-knowledge-format';
import { knowledgeArchitecture } from './knowledge-architecture';

/** Staged ai-retrieval items (from ai-cauldron). Not yet wired into CONTENT. */
export const AI_RETRIEVAL: Nugget[] = [
  whatIsRag,
  ragPipeline,
  vectorDatabases,
  chunkingStrategies,
  buildingFirstRag,
  naiveVsProduction,
  improvementsAndAdvanced,
  commonIssues,
  evaluationMetrics,
  ragToolsAndFrameworks,
  lateChunking,
  multiVectorRetrieval,
  ragFusion,
  contextualCompression,
  semanticCaching,
  openKnowledgeFormat,
  knowledgeArchitecture,
];
