import type { Nugget } from '@/types';
import { apiBestPractices } from './api-best-practices';
import { dockerGettingStarted } from './docker-getting-started';

/** Add a new guide's import here — see CLAUDE.md "Adding a guide". */
export const GUIDES: Nugget[] = [apiBestPractices, dockerGettingStarted];
