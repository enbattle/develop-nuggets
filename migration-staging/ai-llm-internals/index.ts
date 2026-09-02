import type { Nugget } from '@/types';
import { inference } from './inference';
import { kvCache } from './kv-cache';
import { contextWindow } from './context-window';
import { contextCollapse } from './context-collapse';
import { quantization } from './quantization';
import { promptCaching } from './prompt-caching';
import { structuredOutputs } from './structured-outputs';
import { speculativeDecoding } from './speculative-decoding';
import { mixtureOfExperts } from './mixture-of-experts';
import { tokenization } from './tokenization';

/** Staged ai-llm-internals items (from ai-cauldron). Not yet wired into CONTENT. */
export const AI_LLM_INTERNALS: Nugget[] = [
  inference,
  kvCache,
  contextWindow,
  contextCollapse,
  quantization,
  promptCaching,
  structuredOutputs,
  speculativeDecoding,
  mixtureOfExperts,
  tokenization,
];
