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

/** ai-llm-internals guides (ported from ai-cauldron's foundations module), in track order. */
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
