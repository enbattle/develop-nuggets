import type { Nugget } from '@/types';
import { whatIsAgentHarness } from './what-is-agent-harness';
import { frameworkLandscape } from './framework-landscape';
import { orchestrationPatterns } from './orchestration-patterns';
import { continuousIterationLoops } from './continuous-iteration-loops';
import { toolStateManagement } from './tool-state-management';
import { humanInTheLoop } from './human-in-the-loop';
import { observabilityTracing } from './observability-tracing';
import { productionDeployment } from './production-deployment';
import { durableExecution } from './durable-execution';
import { streamingArchitecture } from './streaming-architecture';

/** Staged ai-orchestration items (from ai-cauldron). Not yet wired into CONTENT. */
export const AI_ORCHESTRATION: Nugget[] = [
  whatIsAgentHarness,
  frameworkLandscape,
  orchestrationPatterns,
  continuousIterationLoops,
  toolStateManagement,
  humanInTheLoop,
  observabilityTracing,
  productionDeployment,
  durableExecution,
  streamingArchitecture,
];
