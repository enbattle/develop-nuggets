## What it is

Sharding splits a dataset across multiple database instances ("shards"),
each holding a subset of the rows, so no single machine has to store or
serve the whole dataset. The central design decision is the **shard
key** (which column(s) determine which shard a row lives on), since
that choice determines both how evenly data spreads and which queries
stay fast. For how this differs from partitioning within a single
instance, see
[Partitioning vs. Sharding](/nuggets/partitioning-vs-sharding).

## Strategies

- **Range-based**: shard by a value's range (e.g. user IDs 1–1M on shard
  A, 1M–2M on shard B). Simple, and range queries stay on one shard.
  But traffic and data are rarely uniform across ranges, creating hot
  shards (all new signups landing on the newest, single shard).
- **Hash-based**: hash the shard key and mod by shard count (or use
  [consistent hashing](/nuggets/consistent-hashing) to avoid a full
  reshuffle when shard count changes). Spreads load evenly, but a range
  query ("all orders from June") now has to fan out to every shard.
- **Directory-based**: a separate lookup service maps each key to its
  shard explicitly. Most flexible (individual keys can be rebalanced),
  but the directory itself becomes a critical, must-scale dependency and
  an extra hop on every query.

## Choosing a shard key

The right key is whatever the majority of queries filter by: sharding
by `user_id` is right when nearly every query is scoped to one user
(most SaaS apps); wrong if a common query needs to join across users
(e.g. "all orders in a region"), since that becomes a fan-out or
cross-shard join. There's rarely a shard key that's optimal for every
access pattern; the choice trades off which queries stay cheap.

## Hot shards

Any strategy can still concentrate load on one shard if the key
distribution is skewed: a celebrity user with 10x normal activity, a
viral product, a range of sequential IDs all created in the same burst.
Mitigations: composite keys that add entropy (`user_id + random_suffix`
for a write-heavy hot key), splitting an overloaded shard further, or
caching in front of the hot shard rather than resharding for one
outlier.

## Resharding

Changing the number of shards later is expensive under naive
hash-modulo sharding: nearly every key moves. The same problem
[consistent hashing](/nuggets/consistent-hashing) solves for cache
nodes applies directly to database shards, which is why systems built
for elastic scaling generally use it instead of a raw modulo.

## Where it applies

Any dataset too large or too hot for one database instance — user data
in a multi-tenant SaaS, event/analytics tables, anything sharded across
Cassandra, DynamoDB, Vitess, or Citus.

## No universal answer

There's no universally "correct" shard key, only one that matches the
dominant query pattern. Picking it is a decision about which queries
you're willing to make expensive (cross-shard) in exchange for making
the common ones cheap (single-shard).
