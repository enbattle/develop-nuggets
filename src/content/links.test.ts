import { describe, it, expect } from 'vitest';
import { CONTENT, contentPath, getContent } from './index';

// Matches a markdown link whose href is an in-app content route, e.g.
// `[idempotent](/nuggets/idempotency)` or `[the guide](/guides/oauth)`.
const INTERNAL_LINK = /\]\((\/(?:nuggets|guides)\/[a-z0-9-]+)\)/g;

describe('internal content links', () => {
  it('every /nuggets or /guides link in a body resolves to a real item under the right prefix', () => {
    const broken: string[] = [];

    for (const item of CONTENT) {
      for (const [, href] of item.body.matchAll(INTERNAL_LINK)) {
        const id = href.split('/').pop()!;
        const target = getContent(id);
        if (!target) {
          broken.push(`${item.id} → ${href} (no such item)`);
        } else if (contentPath(target) !== href) {
          broken.push(
            `${item.id} → ${href} (item is a ${target.format}; correct path is ${contentPath(target)})`,
          );
        }
      }
    }

    expect(broken).toEqual([]);
  });
});
