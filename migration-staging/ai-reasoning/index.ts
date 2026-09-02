import type { Nugget } from '@/types';
import { reasoningModels } from './reasoning-models';
import { extendedThinking } from './extended-thinking';
import { chainOfThought } from './chain-of-thought';
import { rewardModels } from './reward-models';
import { treeOfThoughts } from './tree-of-thoughts';
import { reflexionMetaPrompting } from './reflexion-meta-prompting';
import { evaluatingReasoning } from './evaluating-reasoning';
import { whenToFinetune } from './when-to-finetune';
import { loraQlora } from './lora-qlora';
import { instructionFinetuning } from './instruction-finetuning';
import { dpo } from './dpo';
import { structuredOutputsFinetuning } from './structured-outputs-finetuning';
import { distillation } from './distillation';
import { modelMerging } from './model-merging';
import { evaluatingFinetuned } from './evaluating-finetuned';

/** Staged ai-reasoning items (from ai-cauldron). Not yet wired into CONTENT. */
export const AI_REASONING: Nugget[] = [
  reasoningModels,
  extendedThinking,
  chainOfThought,
  rewardModels,
  treeOfThoughts,
  reflexionMetaPrompting,
  evaluatingReasoning,
  whenToFinetune,
  loraQlora,
  instructionFinetuning,
  dpo,
  structuredOutputsFinetuning,
  distillation,
  modelMerging,
  evaluatingFinetuned,
];
