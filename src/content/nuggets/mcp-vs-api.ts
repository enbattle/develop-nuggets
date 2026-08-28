import body from './mcp-vs-api.md?raw';
import type { Nugget } from '@/types';

export const mcpVsApi: Nugget = {
  id: 'mcp-vs-api',
  title: 'MCP vs. API',
  summary:
    'How the Model Context Protocol differs from a plain REST API, and when an LLM tool integration wants one over the other.',
  tags: ['ai', 'apis'],
  section: 'apis-communication',
  body,
  format: 'nugget',
};
