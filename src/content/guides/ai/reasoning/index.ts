import type { Nugget } from '@/types';
import { reasoningModels } from './reasoning-models';
import { extendedThinking } from './extended-thinking';
import { chainOfThought } from './chain-of-thought';
import { rewardModels } from './reward-models';
import { treeOfThoughts } from './tree-of-thoughts';
import { reflexionMetaPrompting } from './reflexion-meta-prompting';
import { evaluatingReasoning } from './evaluating-reasoning';

/** ai-reasoning guides (ported from ai-cauldron's reasoning module), in track order. */
export const AI_REASONING: Nugget[] = [
  reasoningModels,
  extendedThinking,
  chainOfThought,
  rewardModels,
  treeOfThoughts,
  reflexionMetaPrompting,
  evaluatingReasoning,
];
