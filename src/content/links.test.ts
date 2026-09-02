import { describe, it, expect } from 'vitest';
import { CONTENT, contentPath, getContent } from './index';
import { getTrack } from './tracks';
import { getInteractive } from '@/components/interactive/registry';

// Matches a markdown link whose href is an in-app content route, e.g.
// `[idempotent](/nuggets/idempotency)` or `[the guide](/guides/oauth)`.
const CONTENT_LINK = /\]\((\/(?:nuggets|guides)\/[a-z0-9-]+)\)/g;
// The other two in-app link shapes bodies use.
const TRACK_LINK = /\]\((\/tracks\/[a-z0-9-]+)\)/g;
const INTERACTIVE_LINK = /\]\((\/interactive\/[a-z0-9-]+)\)/g;

describe('internal content links', () => {
  it('every /nuggets or /guides link in a body resolves to a real item under the right prefix', () => {
    const broken: string[] = [];

    for (const item of CONTENT) {
      for (const [, href] of item.body.matchAll(CONTENT_LINK)) {
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

  it('every /tracks link resolves to a real track', () => {
    const broken: string[] = [];
    for (const item of CONTENT) {
      for (const [, href] of item.body.matchAll(TRACK_LINK)) {
        if (!getTrack(href.split('/').pop()!)) {
          broken.push(`${item.id} → ${href} (no such track)`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it('every /interactive link resolves to a registered algorithm', () => {
    const broken: string[] = [];
    for (const item of CONTENT) {
      for (const [, href] of item.body.matchAll(INTERACTIVE_LINK)) {
        if (!getInteractive(href.split('/').pop()!)) {
          broken.push(`${item.id} → ${href} (no such interactive demo)`);
        }
      }
    }
    expect(broken).toEqual([]);
  });
});
