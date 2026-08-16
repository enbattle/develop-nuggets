## What it is

An index is an auxiliary data structure — usually a B-tree — that lets a
database find matching rows without scanning the whole table. It trades
extra storage and slower writes for much faster reads on the indexed
columns.

## Why it matters

Without an index, `WHERE email = ?` has to check every row (a "sequential
scan" / "table scan") — fine with a few hundred rows, catastrophic with a
few million. This is the other half of "why is this query slow" alongside
[the N+1 query problem](/nuggets/n-plus-one-queries): N+1 is about issuing
too many queries, indexing is about making each individual query fast.

## How it works, briefly

A B-tree keeps keys sorted in a shallow, wide tree structure, so a lookup
is `O(log n)` — a handful of comparisons — instead of `O(n)`, checking every
row one at a time. A composite index (built on multiple columns) is sorted
by the first column, then the second within ties, and so on — which is why
it only helps a query that filters on a matching left-to-right prefix of
those columns.

```sql
CREATE INDEX idx_users_email ON users (email);

EXPLAIN SELECT * FROM users WHERE email = 'a@example.com';
-- without the index: Seq Scan on users
-- with the index:    Index Scan using idx_users_email
```

## When it doesn't help — or actively hurts

- Every index speeds up reads on that column but slows down every
  `INSERT`/`UPDATE`/`DELETE` on the table, since the index has to be
  maintained too. Indexing everything "just in case" has a real,
  ongoing cost.
- Low-cardinality columns (like a boolean) often don't benefit much — the
  query planner may decide a sequential scan is cheaper than jumping in
  and out of an index for a value half the rows share.
- A composite index on `(a, b)` helps a query filtering on `a`, or on
  `a AND b`, but not one filtering on `b` alone.

## Where it applies

Any relational database, and the same idea shows up conceptually in search
backends like Elasticsearch (an inverted index) and in NoSQL stores with
secondary indexes.

## Key insight

Index the columns your queries actually filter, sort, or join on — no
more, no less — and use `EXPLAIN` (or your database's equivalent) to
confirm a query is actually using the index you expect, rather than
assuming it.
