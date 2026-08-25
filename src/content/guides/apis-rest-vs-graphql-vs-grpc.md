Three different answers to "how should a client and a server talk to
each other," each optimizing for a different shape of problem. This
guide compares the three directly; for the operational concerns that
apply regardless of which you pick (auth, rate limiting, versioning,
error shapes), see [APIs: Best Practices](/guides/api-best-practices).

## REST

REST models an API as a set of **resources**, each with a URL, acted on
with standard HTTP verbs:

```
GET    /orders/42        → fetch order 42
POST   /orders            → create an order
PATCH  /orders/42        → partially update it
DELETE /orders/42        → remove it
```

Simple, cacheable (HTTP caching semantics apply directly — see
`Cache-Control`/`ETag` in the APIs: Best Practices guide), and universally
understood. Its weakness shows up with nested or varied data
requirements: a mobile client that only needs an order's total and a web
client that needs the full order with line items and customer details
either share one bloated response (**over-fetching**) or the API grows a
proliferation of `?fields=` query params and specialized endpoints to
avoid it.

## GraphQL

GraphQL exposes a single endpoint and lets the client specify exactly
what shape of data it wants in the query itself:

```graphql
query {
  order(id: 42) {
    total
    customer { name }
  }
}
```

The server returns exactly that shape — no more, no less — which
directly solves REST's over/under-fetching problem: one query gets one
client's mobile summary, a different query gets the web client's full
detail, from the same schema. The tradeoff moves the complexity
server-side: a naive resolver implementation that fetches each nested
field with its own lookup is precisely
[the N+1 query problem](/nuggets/n-plus-one-queries) at the API layer:
resolving `order.customer` once per order in a list, instead of batching
it. Tools like DataLoader exist specifically to batch and cache resolver
calls within a single request to avoid this. HTTP caching also mostly
stops working, since every query is a `POST` to the same URL with a
different body — caching has to happen at the application layer instead.

## gRPC

gRPC defines a service's methods and message shapes in a strongly-typed
`.proto` file, compiles client/server stubs in whatever languages you
need, and communicates via binary Protocol Buffers over HTTP/2 instead
of JSON over HTTP/1.1:

```protobuf
service OrderService {
  rpc GetOrder(GetOrderRequest) returns (Order);
  rpc StreamOrderUpdates(OrderId) returns (stream OrderUpdate);
}
```

Binary encoding is smaller and faster to (de)serialize than JSON, and
the generated stubs mean a client can't send a malformed request that
compiles — the contract is enforced by the type system, not just
documentation. HTTP/2 also gives it native support for streaming (a
server can push a sequence of messages over one call, not just one
response). The cost: it's not human-readable on the wire (no
curl-and-eyeball debugging), and it's a poor fit for a public API
consumed directly by browsers, which don't speak gRPC natively without a
proxy layer (grpc-web).

## Choosing

| | Best fit | Weak point |
| --- | --- | --- |
| REST | Public APIs, simple CRUD, anything wanting HTTP caching for free | Over/under-fetching on complex, nested data |
| GraphQL | Multiple client shapes (web/mobile) sharing one backend, complex nested queries | N+1 resolvers, weaker HTTP-level caching |
| gRPC | Internal service-to-service calls, streaming, performance-sensitive paths | Not browser-native, no human-readable payloads |

A single system commonly uses more than one: gRPC between internal
services (where performance and strict contracts matter most), REST or
GraphQL at the public edge (where broad client compatibility matters
most).

## Where to go from here

Rate limiting, auth, versioning, and consistent error handling apply to
a REST, GraphQL, or gRPC API alike; none of these three choices replaces
that other layer of API design. See
[APIs: Best Practices](/guides/api-best-practices) for those.
