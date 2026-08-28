Relational databases (Postgres, MySQL, and similar) are the default
starting point for most new systems, and understanding what their ACID
guarantees actually buy you is what separates "we use Postgres" from
knowing when that's genuinely the right call. For choosing relational
vs. other models in the first place, see
[Data Modeling](/guides/data-modeling) and
[SQL vs. NoSQL](/nuggets/sql-vs-nosql).

## ACID, concretely

- **Atomicity** — a transaction's statements all commit or none do.
  Transfer $10 from account A to account B: debit A and credit B either
  both happen or neither does. There's no state where the money left A
  but never arrived at B.
- **Consistency** — a transaction can only move the database from one
  valid state to another, per its own constraints (foreign keys, unique
  constraints, checks). The database itself refuses a write that would
  violate them, rather than trusting application code to check first.
- **Isolation** — concurrent transactions don't see each other's
  uncommitted, in-progress changes — see isolation levels, below, for
  exactly how much.
- **Durability** — once a transaction commits, it survives a crash
  immediately after (via the write-ahead log, the same mechanism
  [Change Data Capture](/nuggets/change-data-capture) reads from).

## Isolation levels

Isolation is a dial, not a single guarantee, and the level chosen trades
correctness for concurrency:

| Level            | Prevents             | Allows                                                                       |
| ---------------- | -------------------- | ---------------------------------------------------------------------------- |
| Read Uncommitted | Nothing              | Dirty reads (seeing another transaction's uncommitted writes)                |
| Read Committed   | Dirty reads          | Non-repeatable reads (a row you re-read mid-transaction has changed)         |
| Repeatable Read  | Non-repeatable reads | Phantom reads (a _new_ row matching your query appears on re-query)          |
| Serializable     | Everything           | Transactions behave as if run one at a time — full safety, least concurrency |

Most applications default to Read Committed (Postgres's default) and
only reach for stricter isolation for specific operations that genuinely
need it (like the version-check pattern in
[Optimistic vs. Pessimistic Locking](/nuggets/optimistic-vs-pessimistic-locking)).
Serializable everywhere is correct but expensive, since it forces far
more transaction retries under contention.

## Postgres vs. MySQL, briefly

Both are mature, ACID-compliant, and broadly similar for most
applications; the practical differences that actually matter for a
choice are narrower than the debate around them suggests. Postgres has
richer built-in data types and extensions (`JSONB`, `PostGIS` for
[geospatial indexing](/nuggets/geospatial-indexing), `pgvector` for
[vector search](/nuggets/vector-databases)) and a reputation for
stricter standards compliance; MySQL has historically had a simpler
replication story and remains extremely common in existing
infrastructure. Neither is "faster" in a way that generalizes across
workloads: the extensions and ecosystem fit matter more than raw
performance for most real choices.

## Connections are a limited resource

Each connection costs the database a backend process (or thread) and its
own memory, so servers cap connections in the low hundreds by default. An
app that opens one connection per request exhausts that ceiling under
load, and further requests block waiting for one to free up. The fix is a
**connection pool** — a fixed set of long-lived connections the app
borrows and returns — sized to the database's limit, not the app's
request concurrency. At larger scale a dedicated pooler (PgBouncer)
multiplexes many app connections onto a few database ones. This is the
bottleneck
[Numbers Every Engineer Should Know](/nuggets/numbers-every-engineer-should-know)
is pointing at when it says the database connection is usually the limit
before the network is.

## Where it applies

Any data with genuine structure and relationships that benefit from the
database enforcing them — orders, accounts, inventory, anything where
"can this write even be applied validly" is a question worth the
database answering rather than trusting the application layer alone.

## Where to go from here

A single relational instance eventually hits a scaling ceiling on
writes — see [Sharding Strategies](/nuggets/sharding-strategies) and
[Scaling Reads vs. Scaling Writes](/nuggets/scaling-reads-vs-scaling-writes)
for what comes after "add a bigger server."
