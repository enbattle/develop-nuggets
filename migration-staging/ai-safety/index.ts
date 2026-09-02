import type { Nugget } from '@/types';
import { failureModes } from './failure-modes';
import { promptInjection } from './prompt-injection';
import { redTeaming } from './red-teaming';
import { guardrailsFrameworks } from './guardrails-frameworks';
import { outputValidation } from './output-validation';
import { piiPrivacy } from './pii-privacy';
import { contentModeration } from './content-moderation';
import { aiGovernance } from './ai-governance';

/** Staged ai-safety items (from ai-cauldron). Not yet wired into CONTENT. */
export const AI_SAFETY: Nugget[] = [
  failureModes,
  promptInjection,
  redTeaming,
  guardrailsFrameworks,
  outputValidation,
  piiPrivacy,
  contentModeration,
  aiGovernance,
];
