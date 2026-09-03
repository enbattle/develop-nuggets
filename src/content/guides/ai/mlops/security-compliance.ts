import body from './security-compliance.md?raw';
import type { Nugget } from '@/types';

export const securityCompliance: Nugget = {
  id: 'security-compliance',
  title: 'Security & Compliance',
  summary:
    'The ops-and-compliance side of AI security — auth and RBAC, immutable audit logs, encryption, data retention, and a SOC 2-style checklist.',
  tags: ['ai', 'mlops', 'security', 'process'],
  section: 'ai-mlops',
  body,
  format: 'guide',
};
