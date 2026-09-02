import type { Nugget } from '@/types';
import { whatAreEvals } from './what-are-evals';
import { evaluationTypes } from './evaluation-types';
import { essentialMetrics } from './essential-metrics';
import { buildingFirstEval } from './building-first-eval';
import { evaluationWorkflow } from './evaluation-workflow';
import { commonPitfalls } from './common-pitfalls';
import { evalsToolsAndFrameworks } from './evals-tools-and-frameworks';
import { evalsAdvancedTopics } from './evals-advanced-topics';
import { benchmarkContamination } from './benchmark-contamination';
import { promptRegressionTesting } from './prompt-regression-testing';
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

/** Staged ai-evaluation items (from ai-cauldron). Not yet wired into CONTENT. */
export const AI_EVALUATION: Nugget[] = [
  whatAreEvals,
  evaluationTypes,
  essentialMetrics,
  buildingFirstEval,
  evaluationWorkflow,
  commonPitfalls,
  evalsToolsAndFrameworks,
  evalsAdvancedTopics,
  benchmarkContamination,
  promptRegressionTesting,
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
