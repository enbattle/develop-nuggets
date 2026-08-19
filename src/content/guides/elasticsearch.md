Elasticsearch is a search engine built around the **inverted index** —
a data structure optimized for a fundamentally different question than
what a database index answers.

## The inverted index

A normal [database index](/nuggets/database-indexing) (a B-tree) maps a
value to the rows containing it — fast for "find the row where
`email = 'x'`," bad at "find every row whose `description` *contains*
the word 'waterproof' anywhere in a paragraph of text." An inverted
index flips the relationship: it maps each individual **term** to the
list of documents containing it.

```
"waterproof" → [doc_12, doc_47, doc_203, ...]
"jacket"     → [doc_12, doc_88, doc_203, ...]
```

A search for "waterproof jacket" intersects both lists — documents
containing both terms — which is fast regardless of how long the
underlying text field is, unlike a `LIKE '%waterproof%'` scan against a
relational column, which can't use a B-tree at all and falls back to
checking every row.

## Documents, indices, and mapping

Elasticsearch stores schema-flexible JSON **documents**, grouped into an
**index** (roughly analogous to a database table, though the analogy
breaks down quickly). A **mapping** defines how each field is analyzed —
whether a text field gets tokenized and lowercased for full-text search,
or stored as an exact-match keyword (useful for filtering/aggregating,
not full-text search) — getting this wrong (e.g. mapping a field as
`keyword` when you needed full-text search on it) is a common source of
"my search isn't finding an obvious match" bugs.

## Relevance ranking

Unlike an exact-match database query, a text search returns *ranked*
results — Elasticsearch scores each match (commonly via **BM25**, which
weighs terms higher if they're rare across the corpus but frequent in a
specific document) so "best match first" is a first-class concept, not
something the application has to compute itself.

## When to reach for it vs. a database index

A relational database's full-text search extensions (like Postgres's
`GIN` index, mentioned in
[Database Indexing](/nuggets/database-indexing)) work fine for
moderate-scale, simple text search without introducing a second system.
Elasticsearch earns its place once search needs go beyond that: faceted
search (filter by category *and* price range *and* rating,
simultaneously, fast), typo tolerance (fuzzy matching), relevance tuning,
or search volume/data size that a single relational instance can't
comfortably serve alongside its transactional workload.

## Where it applies

Product search, log search/analysis (the "ELK stack" — Elasticsearch,
Logstash, Kibana — is a common [observability](/nuggets/observability)
logs backend), and full-text search over any large document collection.

## Key insight

Elasticsearch isn't a faster database — it's a different index
structure (inverted, not B-tree) built to answer "which documents match
these terms, ranked by relevance," a question a B-tree was never
designed to answer efficiently at all.
