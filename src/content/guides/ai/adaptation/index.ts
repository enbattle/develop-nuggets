import type { Nugget } from '@/types';
import { whenToFinetune } from './when-to-finetune';
import { loraQlora } from './lora-qlora';
import { instructionFinetuning } from './instruction-finetuning';
import { dpo } from './dpo';
import { structuredOutputsFinetuning } from './structured-outputs-finetuning';
import { distillation } from './distillation';
import { modelMerging } from './model-merging';
import { evaluatingFinetuned } from './evaluating-finetuned';

/** ai-adaptation guides (ported from ai-cauldron's adaptation module), in track order. */
export const AI_ADAPTATION: Nugget[] = [
  whenToFinetune,
  loraQlora,
  instructionFinetuning,
  dpo,
  structuredOutputsFinetuning,
  distillation,
  modelMerging,
  evaluatingFinetuned,
];
