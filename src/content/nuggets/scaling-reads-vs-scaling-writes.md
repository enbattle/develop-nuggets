## What it is

Read-heavy and write-heavy workloads scale via genuinely different
techniques, and conflating them is a common design mistake — throwing a
read-scaling technique (like a cache) at a write-heavy problem does
nothing, and vice versa.

## Scaling reads

Reads are usually the easier side, because a read can be served from a
**copy** of the data:

- **Caching** — serve hot data from memory instead of the database; see
  [Cache Invalidation](/nuggets/cache-invalidation) and
  [Cache vs. Freshness](/nuggets/cache-vs-freshness) for the correctness
  side of this.
- **Read replicas** — one or more read-only copies of the database, kept
  in sync (usually asynchronously) with the primary. Reads scale by
  adding more replicas; writes still all go through the single primary.
- **CDN** — for content that's the same for every user, push it to edge
  servers close to the reader.

The common thread: all of these add copies, and copies mean the reader
might see slightly stale data — a
[Cache vs. Freshness](/nuggets/cache-vs-freshness)-shaped tradeoff, not
a free win.

## Scaling writes

Writes are harder, because every write eventually has to land somewhere
authoritative — there's no copying your way out of needing to actually
store the new data:

- **Sharding/partitioning** — split writes across multiple database
  instances so no single machine takes all the write load; see
  [Sharding Strategies](/nuggets/sharding-strategies).
- **Write-behind / async processing** — acknowledge the write once it's
  durably queued (a message broker, a write-ahead log), and apply it to
  the actual store slightly later, trading immediate consistency for
  write throughput.
- **Batching** — combine many small writes into fewer, larger ones,
  amortizing per-write overhead (a transaction commit, a network round
  trip) — the same [Latency vs. Throughput](/nuggets/latency-vs-throughput)
  tradeoff batching always makes.

## Where it applies

Any system design discussion of "how does this scale" should ask reads
and writes separately — a social feed is read-heavy (many more views
than posts) and leans on caching and replicas; a metrics ingestion
pipeline is write-heavy (constant high-volume writes, comparatively
rare reads) and leans on sharding, batching, and async ingestion.

## Key insight

Reads scale by adding copies; writes scale by splitting the
authoritative data itself. A design that's struggling with write load
needs sharding or async processing, not a bigger cache — a cache can
only make reads of already-written data faster, it can't absorb more
writes.
