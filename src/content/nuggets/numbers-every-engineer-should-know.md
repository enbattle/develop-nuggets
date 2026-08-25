## What it is

A rough set of latency, throughput, and storage figures worth having
memorized well enough to sanity-check a design on the spot — not exact
benchmarks (real numbers vary by hardware, network, and year), but the
right order of magnitude to reason about whether a design is even
plausible.

## Latency numbers

| Operation | Approximate latency |
| --- | --- |
| L1 cache reference | ~1 ns |
| Main memory (RAM) reference | ~100 ns |
| SSD random read | ~100 μs |
| Round trip within the same datacenter | ~0.5 ms |
| HDD seek | ~10 ms |
| Round trip, cross-country (e.g. US coast to coast) | ~50 ms |
| Round trip, cross-continent | ~150 ms |

The jump between rows matters more than the exact number: memory is
roughly 100x faster than SSD, which is roughly 100x faster than a
cross-country network round trip. A design that hides an unnecessary
cross-region round trip behind something that could have been served
from memory is leaving two or three orders of magnitude on the table.

## Throughput and capacity, by estimation

Back-of-envelope math in an interview usually chains a few of these:

- A single modern server can typically handle on the order of
  **thousands to tens of thousands of requests/second** for simple,
  cacheable reads; far less (hundreds to low thousands) for anything
  hitting a database with real work per query.
- A single database connection or query is usually the bottleneck well
  before the network is. This is why connection pooling and read
  replicas show up so often in scaling discussions.
- **1 million requests/day ≈ ~12 requests/second average**. But design
  for peak, not average: a 10x peak-to-average ratio is a common,
  reasonable assumption absent better data.

## Storage, by estimation

- A short text row (a tweet, a comment) is roughly **100 bytes – 1 KB**.
- A typical compressed photo is roughly **200 KB – 2 MB**; a minute of
  video, tens of MB.
- 1 million users × 1 KB of profile data ≈ **1 GB**: small. The same 1
  million users' photos at 1 MB each ≈ **1 TB**, which is usually where
  "do we need blob storage, not a database row" becomes obvious.

## Where it applies

Capacity-estimation questions ("how many servers/how much storage would
this need"), and sanity-checking any design's latency budget — if a
request's stated latency requirement is 50ms and the design routes it
through three sequential cross-region calls, the numbers alone say it
can't work before any other analysis does.

## Why memorize them

Skip the calculator and these numbers still catch the obvious break: a
design that's off by 1000x gets flagged with "wait, that can't be right"
instead of surviving an entire interview unchallenged. That's the actual
payoff of having them memorized — not precision, just a fast gut-check
that's always available.
