import type { Nugget } from '@/types';
import { whatIsMlops } from './what-is-mlops';
import { cicdForAi } from './cicd-for-ai';
import { deploymentStrategies } from './deployment-strategies';
import { monitoringObservability } from './monitoring-observability';
import { securityCompliance } from './security-compliance';
import { reliabilityScale } from './reliability-scale';
import { costOptimization } from './cost-optimization';
import { modelLifecycle } from './model-lifecycle';
import { guardrails } from './guardrails';
import { mlopsAdvancedTopics } from './mlops-advanced-topics';
import { promptVersionControl } from './prompt-version-control';
import { dataFlywheels } from './data-flywheels';
import { aiCostOptimization } from './ai-cost-optimization';

/** Staged ai-mlops items (from ai-cauldron). Not yet wired into CONTENT. */
export const AI_MLOPS: Nugget[] = [
  whatIsMlops,
  cicdForAi,
  deploymentStrategies,
  monitoringObservability,
  securityCompliance,
  reliabilityScale,
  costOptimization,
  modelLifecycle,
  guardrails,
  mlopsAdvancedTopics,
  promptVersionControl,
  dataFlywheels,
  aiCostOptimization,
];
