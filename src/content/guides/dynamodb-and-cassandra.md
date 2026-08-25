DynamoDB and Cassandra are the two wide-column/key-value stores that
come up most often in system design discussions — both built from the
start for horizontal write scale and high availability, at the cost of
the strict consistency and rich querying a relational database offers.
See [SQL vs. NoSQL](/nuggets/sql-vs-nosql) for the general tradeoff
these are concrete examples of.

## The data model

Both are built around a **partition key** that determines which node
owns a given row (via [consistent hashing](/nuggets/consistent-hashing)
in both systems), plus an optional key that orders rows *within* a
partition:

- **DynamoDB** — partition key (+ optional **sort key**). All items
  sharing a partition key are stored together and can be range-queried
  by sort key efficiently (e.g. partition key `user_id`, sort key
  `timestamp`, to fetch a user's items in time order).
- **Cassandra** — partition key (+ **clustering columns**). Same idea:
  clustering columns define the on-disk sort order within a partition.

In both, a query that doesn't specify the partition key can't be served
efficiently: there's no B-tree-style secondary index scanning the
whole dataset by default the way a relational database offers. This is
the sharp edge both systems share: the access patterns have to be
designed *before* the schema, not discovered afterward, because
changing how data is queried later often means the partition key was
wrong from the start.

## Consistency model

Both default to **eventual consistency**, and both let you dial it
per-request:

- **DynamoDB** — choose eventually-consistent (cheaper, faster) or
  strongly-consistent (reads always reflect the latest write, at a
  performance cost) per read.
- **Cassandra** — a tunable **consistency level** per query (`ONE`,
  `QUORUM`, `ALL`) that trades off how many replicas must acknowledge a
  read/write before it succeeds — `QUORUM` reads plus `QUORUM` writes
  guarantees you'll always see the latest write, since the two sets of
  replicas are guaranteed to overlap.

This is [CAP Theorem](/nuggets/cap-theorem) made concrete and
adjustable: both systems default toward the **AP** side, but let a
specific query trade some availability/latency back for consistency
when it actually needs it, rather than making the whole system pick
one side globally.

## When to reach for these vs. a relational database

Reach for one of these when write volume or required availability
exceeds what a single-leader relational database can offer, and the
access patterns are genuinely key-based (fetch by a known partition
key) rather than needing ad-hoc joins and complex queries across
unrelated entities. Reach for
[a relational database](/guides/relational-databases) when strong
consistency, transactions across multiple rows, and flexible querying
matter more than horizontal write scale — most applications, until
scale genuinely forces the tradeoff.

## Where to go from here

Both systems' partition-key model is the same sharding decision
described generally in
[Sharding Strategies](/nuggets/sharding-strategies): the "choose the
key that matches your dominant query pattern" principle applies
identically here, just enforced by the database rather than left to a
manual sharding scheme.
