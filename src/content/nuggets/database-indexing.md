## What it is

An index is an auxiliary data structure (usually a B-tree) that lets a
database find matching rows without scanning the whole table. It trades
extra storage and slower writes for much faster reads on the indexed
columns.

## Why it matters

Without an index, `WHERE email = ?` has to check every row (a "sequential
scan" / "table scan"): fine with a few hundred rows, catastrophic with a
few million. This is the other half of "why is this query slow" alongside
[the N+1 query problem](/nuggets/n-plus-one-queries): N+1 is about issuing
too many queries, indexing is about making each individual query fast.

## How it works, briefly

A B-tree keeps keys sorted in a shallow, wide tree structure, so a lookup
is `O(log n)` (a handful of comparisons) instead of `O(n)`, checking every
row one at a time. A composite index (built on multiple columns) is sorted
by the first column, then the second within ties, and so on. That's why
it only helps a query that filters on a matching left-to-right prefix of
those columns.

```sql
CREATE INDEX idx_users_email ON users (email);

EXPLAIN SELECT * FROM users WHERE email = 'a@example.com';
-- without the index: Seq Scan on users
-- with the index:    Index Scan using idx_users_email
```

## Other index types

B-tree is the default and handles equality and range queries
(`=`, `<`, `BETWEEN`, `ORDER BY`) well, but it's not the only structure:

- **Hash index** — O(1) lookup for exact-match equality, but can't serve a
  range query or an `ORDER BY` at all, since a hash has no notion of
  "near": two adjacent keys can hash to completely unrelated buckets.
- **GIN / GiST** (Postgres) — built for values that aren't a single
  scalar: full-text search, JSONB containment queries (`@>`), array
  membership, geospatial data. A B-tree can't index "does this JSONB
  column contain this key" efficiently; GIN can.
- **Bitmap index** — one bit per row per distinct value, cheap to combine
  with AND/OR across multiple conditions. Rarely created explicitly, but
  query planners (Postgres's bitmap heap scan) build one on the fly to
  merge several lower-cardinality conditions before touching the table.

## Clustered vs. non-clustered

A **clustered** index determines the actual physical order rows are
stored in on disk: there can only be one per table (rows can only be
sorted one way at once), and it's usually the primary key by default. A
**non-clustered** index is a separate structure: sorted keys that each
point back to the row's location, rather than containing the row itself.

That extra pointer-chase is why a non-clustered index lookup is often two
steps, not one: find the key in the index, then jump to the row it
points at (a "bookmark lookup"). A **covering index** avoids the second
step entirely by including every column the query needs directly in the
index itself, so the database can answer the query from the index alone
without ever touching the table (an "index-only scan"):

```sql
-- covers a query that only selects id and email — no table lookup needed
CREATE INDEX idx_users_email_covering ON users (email) INCLUDE (id);
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

## Rule of thumb

Index the columns your queries actually filter, sort, or join on — no
more, no less — and use `EXPLAIN` (or your database's equivalent) to
confirm a query is actually using the index you expect, rather than
assuming it.
