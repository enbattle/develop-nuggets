Redis is an in-memory data store — everything lives in RAM by default,
which is what makes it fast (see the RAM-vs-disk gap in
[Numbers Every Engineer Should Know](/nuggets/numbers-every-engineer-should-know)),
and it's reached for in system design far more often as a building
block than as a primary database.

## Core data structures

Unlike a plain key-value cache, Redis's values have real types with
their own operations, not just opaque blobs:

- **Strings** — the simplest type; also how counters work
  (`INCR`/`DECR` are atomic, which is exactly what backs the
  [Rate Limiting](/nuggets/rate-limiting) nugget's distributed-counter
  section).
- **Hashes** — a field → value map within one key, good for representing
  an object (a user's session data) without needing a separate key per
  field.
- **Lists** — ordered, with fast push/pop from either end — a natural
  fit for a simple queue.
- **Sets / Sorted Sets** — unique members, with sorted sets adding a
  score per member, kept in order automatically. This is what backs
  leaderboards (`ZADD`/`ZRANGE` by score) and, as mentioned in
  [Rate Limiting](/nuggets/rate-limiting), a sliding-window request log.

## Caching

The most common use case: sit Redis in front of a slower database and
serve hot reads from memory instead. The mechanics of keeping that cache
correct as underlying data changes are covered in
[Cache Invalidation](/nuggets/cache-invalidation) — Redis is the
concrete implementation of the "cache" in that pattern for most systems
that aren't using a CDN or in-process cache.

## Distributed locks

`SET key value NX EX ttl` provides atomic, TTL-bounded mutual exclusion
across processes — see [Distributed Locks](/nuggets/distributed-locks)
for the full mechanics and the fencing-token gotcha that comes with
using Redis (or anything) this way.

## Pub/Sub

Redis can also act as a lightweight message bus: a `PUBLISH` to a
channel is delivered to every currently-subscribed client. It's not
durable — a subscriber that's offline when a message is published never
receives it, unlike a real queue with persistent storage (see
[Kafka](/guides/kafka)) — which makes it a good fit for ephemeral
fan-out (like the real-time-update fan-out described in
[Networking: Real-Time Communication](/guides/networking-real-time-communication))
and a poor fit for anything that needs guaranteed delivery.

## Persistence, briefly

Redis is in-memory first, but isn't necessarily volatile: **RDB**
periodically snapshots the whole dataset to disk (fast to restore from,
but can lose the last few minutes of writes on a crash); **AOF**
(append-only file) logs every write operation and replays it on
restart (more durable, larger on disk, slower to restore). Many
deployments use both, or accept RDB's small data-loss window for pure
cache use cases where the source of truth lives elsewhere anyway.

## Where it applies

Caching, rate limiting, distributed locks, session storage,
leaderboards, and lightweight pub/sub — almost always as an
accelerating layer in front of or alongside a primary database, rarely
as the system of record for data that must never be lost.

## Key insight

Redis's value isn't "a faster key-value store" — it's that its data
structures (sorted sets, atomic counters, TTL-bearing keys) map directly
onto specific distributed-systems problems (rate limiting, locks,
leaderboards) that would otherwise need custom logic built on top of a
plainer store.
