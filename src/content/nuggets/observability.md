## What it is

Observability is the ability to understand what's happening inside a
running system from its external outputs, built from three complementary
signal types: **metrics** (aggregated numbers over time — request rate,
error rate, latency), **logs** (discrete, timestamped events with detail),
and **traces** (the path a single request takes as it moves through
multiple services).

## Why it matters

Each signal answers a different question, and none of them alone is
enough:

- **Metrics** tell you _something_ is wrong — the error rate just spiked.
  Cheap to store, great for dashboards and alerts, but low detail: they
  can't tell you which specific request failed or why.
- **Logs** tell you _what happened_ for one event, in detail — but at
  scale, grepping through logs across dozens of service instances to
  reconstruct a single request's path is slow and painful.
- **Traces** tell you _where_ it went wrong across a distributed call
  graph — which of six services a slow request spent four of its five
  seconds inside.

## How they fit together

```mermaid
flowchart LR
    A["Metrics: something's wrong"] --> B["Traces: where"]
    B --> C["Logs: why"]
```

A typical flow: a dashboard's error-rate metric spikes, an alert fires,
traces for slow or failed requests in that window narrow down which
service is the bottleneck, and that service's logs — found via the trace
ID — give the full detail of what actually happened.

## Where it applies

Any production system beyond a single process. The tooling differs
(Prometheus/Grafana for metrics, structured logging plus a log aggregator,
OpenTelemetry/Jaeger for traces) but the three-signal model is consistent
everywhere. It's also exactly the toolkit for finding out why a
[circuit breaker](/nuggets/circuit-breaker) tripped, or why
[retries](/nuggets/exponential-backoff) aren't succeeding.

## Key insight

Observability isn't "add more logging" — it's having the right signal at
the right granularity for the question being asked. Metrics for "is
something wrong," traces for "where," logs for "why." Reaching for the
wrong one first is a big part of why debugging production incidents so
often takes longer than it should.
