## What it is

The **N+1 query problem**: code fetches a list of `N` records, then loops
over them making one _additional_ query per record to fetch related data —
1 query to get the list, plus N more, instead of a small constant number.

## Example

Fetching 50 blog posts, then each post's author separately:

```python
posts = db.query("SELECT * FROM posts LIMIT 50")  # 1 query

for post in posts:
    post.author = db.query(
        "SELECT * FROM users WHERE id = ?", post.author_id
    )  # 1 query, run 50 times
```

That's 51 round-trips to the database to render one page. With a join or a
batched lookup, it's 1 or 2:

```python
# one query with a join
posts = db.query("""
    SELECT posts.*, users.name AS author_name
    FROM posts JOIN users ON users.id = posts.author_id
    LIMIT 50
""")

# or: one query per *type*, not per row
posts = db.query("SELECT * FROM posts LIMIT 50")
author_ids = [p.author_id for p in posts]
authors = db.query("SELECT * FROM users WHERE id IN (?)", author_ids)
```

## Why it matters

It's invisible in development. With 10 rows of test data, 11 queries is
fast enough that nothing looks wrong. In production with 5,000 rows, it's
5,001 sequential round-trips per request — the classic bug that only shows
up once there's real data, and by then it's often deep inside an ORM's
lazy-loading behavior rather than an obvious loop in application code.

## How to spot it

- Query logging or counting in tests — assert the number of queries a code
  path issues, not just its output.
- APM/tracing tools showing a request made dozens of near-identical queries
  differing only by one `WHERE id = ?` value.
- ORM debug logs during development are the cheapest early warning — most
  ORMs (Django, ActiveRecord, SQLAlchemy) have a query-count assertion or
  a "N+1 detected" warning mode for exactly this reason.

N+1 is about the _number_ of queries; a slow query even after fixing that
is usually a missing [index](/nuggets/database-indexing) — the other half
of "why is this page slow."

## Key insight

The fix is almost always "turn N queries into 1" — via a join, or by
collecting the ids first and issuing one batched `WHERE id IN (...)` query
instead of querying inside the loop. The bug isn't really about queries at
all; it's about fetching related data _inside_ a loop instead of _before_
it.
