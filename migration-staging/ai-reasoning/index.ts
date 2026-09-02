import type { Nugget } from '@/types';
import { reasoningModels } from './reasoning-models';
import { extendedThinking } from './extended-thinking';
import { chainOfThought } from './chain-of-thought';
import { rewardModels } from './reward-models';
import { treeOfThoughts } from './tree-of-thoughts';
import { reflexionMetaPrompting } from './reflexion-meta-prompting';
import { evaluatingReasoning } from './evaluating-reasoning';

/** Staged ai-reasoning items (from ai-cauldron). Not yet wired into CONTENT. */
export const AI_REASONING: Nugget[] = [
  reasoningModels,
  extendedThinking,
  chainOfThought,
  rewardModels,
  treeOfThoughts,
  reflexionMetaPrompting,
  evaluatingReasoning,
];
