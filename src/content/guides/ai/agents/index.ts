import type { Nugget } from '@/types';
import { whatIsAgenticAi } from './what-is-agentic-ai';
import { agentArchitecture } from './agent-architecture';
import { buildingFirstAgent } from './building-first-agent';
import { commonChallenges } from './common-challenges';
import { toolUse } from './tool-use';
import { memorySystems } from './memory-systems';
import { planningReasoning } from './planning-reasoning';
import { evaluation } from './evaluation';
import { agenticAdvancedTopics } from './agentic-advanced-topics';
import { modelContextProtocol } from './model-context-protocol';
import { computerUse } from './computer-use';
import { codeAgents } from './code-agents';
import { voiceAgents } from './voice-agents';

/**
 * Agents guides (migrated from ai-cauldron's `agentic` module).
 * Order is the module's lesson order, which is also the `agents` track order.
 * The top-level guides index re-exports this array into `GUIDES`.
 */
export const AI_AGENTS: Nugget[] = [
  whatIsAgenticAi,
  agentArchitecture,
  buildingFirstAgent,
  commonChallenges,
  toolUse,
  memorySystems,
  planningReasoning,
  evaluation,
  agenticAdvancedTopics,
  modelContextProtocol,
  computerUse,
  codeAgents,
  voiceAgents,
];
