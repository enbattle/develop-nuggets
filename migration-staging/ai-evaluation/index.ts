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
];
