A practical checklist for building or reviewing a JSON HTTP API — the
concerns that come up in almost every non-trivial API but rarely get
written down until something breaks in production. Where a full nugget
already covers a topic in depth, this guide links to it rather than
repeating it; treat this as the map, and the linked nuggets as the
exhibits.

## Rate limiting

Every public (and most internal) endpoints should cap how often a single
client can call them. The mechanics — token bucket, leaky bucket, what to
do when the bucket is empty — are covered in full in
[Rate Limiting](/nuggets/rate-limiting). At the API-design level, the part
that's easy to skip is telling the client what happened, via response
headers:

| Header | Meaning |
| --- | --- |
| `X-RateLimit-Limit` | Requests allowed per window |
| `X-RateLimit-Remaining` | Requests left in the current window |
| `X-RateLimit-Reset` | Unix timestamp when the window resets |
| `Retry-After` | Seconds to wait before retrying (sent with a `429`) |

A client that gets a bare `429` with no other information has to guess how
long to back off; a client that gets `Retry-After: 30` doesn't.

Concrete limits vary a lot by traffic pattern, but real APIs anchor on
numbers like these: GitHub's REST API allows 5,000 requests/hour for an
authenticated user; Stripe's default is 100 requests/second in live mode.
Neither is a universal default to copy — the point is picking a number
deliberately from expected legitimate traffic, not leaving it unset.

## Authentication & authorization

Keep these two separate in your head even when they're adjacent in code:
**authentication** answers "who is this," **authorization** answers "what
are they allowed to do." A request can be authenticated (a valid API key)
and still be unauthorized (that key's owner doesn't have access to this
resource) — collapsing the two into one check is a common source of
privilege-escalation bugs.

- **API keys** are simplest and fine for server-to-server calls, but they
  don't expire on their own and are easy to leak into logs or client-side
  code — never ship one in a mobile app or SPA bundle expecting it to stay
  secret.
- **OAuth 2.0** is the right tool when a *user* needs to grant a *third
  party* limited access to their account — it exists specifically to avoid
  handing out the user's actual password.
- **JWTs** are a good transport for short-lived, self-contained claims
  (user id, roles, expiry) but are not a session-revocation mechanism by
  default — a stolen JWT is valid until it expires, full stop, unless you
  add an explicit revocation list.

Whatever the mechanism, grant the narrowest scope that does the job. A key
that can only read one resource type does far less damage when it leaks
than one with blanket access.

### OAuth 2.0 grant types, briefly

Not every OAuth flow is the right tool for the same job:

- **Authorization code** (+ PKCE) — the flow for anything with a user and
  a browser: the user authenticates on the provider's own page, the
  provider redirects back with a short-lived code, and the app exchanges
  that code — plus a PKCE verifier, which stops the code from being
  replayed by whatever might have intercepted the redirect — for tokens
  server-side. This is the only flow that belongs in a user-facing login.
- **Client credentials** — no user at all: one service authenticating as
  *itself* to call another. The client authenticates directly with its
  own id and secret and gets a token back.
- **Implicit** (deprecated) — used to be recommended for browser-only
  apps with no backend, returning the token directly in the redirect
  URL's fragment. Superseded by authorization code + PKCE, which never
  exposes a token in a URL at all; avoid implicit in new work.

### How a JWT is actually verified

A JWT is three base64url segments — `header.payload.signature`.
*Verifying* one means recomputing the signature over the header and
payload with the expected key and comparing it, not just decoding the
payload and trusting what it says — decoding requires no key at all;
verifying is the part that actually proves the token wasn't tampered
with.

- **HS256** signs and verifies with the *same* shared secret — simple,
  but every service that verifies a token needs that secret, which means
  every one of them could also mint a valid token.
- **RS256** signs with a private key and verifies with the corresponding
  public key — a verifier never needs, or gets, the ability to mint a
  token. This is the right default once more than one service needs to
  verify tokens.
- Public keys for RS256 verification are normally published at a **JWKS**
  endpoint (`/.well-known/jwks.json`) and rotated by publishing a new key
  alongside the old one for an overlap period, so tokens signed just
  before rotation still verify until they naturally expire.

A JWT's `exp` claim is enforced by whoever verifies it — nothing stops a
captured, still-unexpired token from being replayed until that expiry
hits. That's why short-lived access tokens (minutes, not days) paired
with a separate, revocable **refresh token** — exchanged for a new access
token, checked against a server-side revocation list — is the standard
pattern for anything that needs to support logging a user out on demand.

## Input validation

Validate at the boundary, before untrusted data touches business logic or
a query — and prefer an allow-list ("must be one of these values, this
shape") over a deny-list ("reject anything that looks like an attack"),
since a deny-list only blocks the attacks you thought of. The single most
damaging validation failure — building a database query out of unvalidated
input directly — is its own nugget:
[SQL Injection & Parameterized Queries](/nuggets/sql-injection). The same
"never let input be interpreted as code" principle extends to shell
commands, template rendering, and deserialization of untrusted payloads.

## Idempotency for unsafe operations

Any endpoint a client might reasonably retry — which, over a real network,
is most of them — needs a defined retry story. `GET`/`PUT`/`DELETE` are
idempotent by definition (repeating them is safe); `POST` generally isn't,
which is exactly the problem an **idempotency key** solves. Full mechanics,
including the client/server exchange, are in [Idempotency](/nuggets/idempotency).
If your API has a `POST /orders` or `POST /payments`-shaped endpoint and no
idempotency story, that's a gap worth closing before it causes a
double-charge in production.

## Versioning

Decide how you'll evolve the API *before* the first breaking change is
forced on you, not during the incident. The two common approaches — a
version segment in the URL (`/v2/users`) vs. a header
(`Accept: application/vnd.myapi.v2+json`) — trade discoverability
(URL versions are visible in every log line and browser tab) for purity
(a resource's identity shouldn't change with its representation). Either
is defensible; picking neither and instead making silent breaking changes
to `v1` is the one option that isn't. See
[Semantic Versioning](/nuggets/semantic-versioning) for how to communicate
the severity of a given change once you have a scheme.

## Pagination

Offset-based pagination (`?page=3&limit=20`) is simple but unstable under
concurrent writes — if a row is inserted before page 3 while a client is
paging through, they'll see one row twice and skip another. Cursor-based
pagination (`?after=<opaque-cursor>`) avoids that by anchoring to a
specific row rather than a numeric position, at the cost of not supporting
"jump to page 7." Default to cursor-based for any collection that's
written to concurrently with being read; offset is fine for small,
mostly-static lists.

## Caching & response shape

Two performance concerns that show up in almost every API, both backed by
their own nuggets:

- **HTTP caching** — send an `ETag` (a hash of the response body) or
  `Last-Modified`, and honor conditional requests (`If-None-Match` /
  `If-Modified-Since`) with a `304 Not Modified` when nothing's changed,
  saving the client a full re-download. `Cache-Control` tells shared
  caches (a CDN, a browser) how long they may serve a response without
  asking again. Deciding how stale is acceptable, and for how long, is
  exactly [Cache vs. Freshness](/nuggets/cache-vs-freshness); keeping a
  server-side cache correct as the underlying data changes is
  [Cache Invalidation](/nuggets/cache-invalidation).
- **Nested or related resources** — an endpoint that returns a list, then
  triggers a separate lookup per item for related data (an order's line
  items, a post's author), is the API-layer shape of
  [the N+1 query problem](/nuggets/n-plus-one-queries) — whether that
  per-item lookup is a database query or a call to another internal
  service, the fix is identical: batch it, or fetch it once alongside the
  list instead of once per item in the response.

## Consistent error responses

Pick one error shape and use it everywhere, including for errors your
framework generates automatically (a raw 500 stack trace in JSON is not
that shape). At minimum:

```json
{
  "error": {
    "code": "insufficient_funds",
    "message": "Account balance is too low to complete this transaction.",
    "request_id": "req_7f3a9c2e"
  }
}
```

`code` is for programs to branch on (stable, never changes wording);
`message` is for humans (can change wording freely); `request_id` ties the
response back to your logs/traces — see Observability below. Use real HTTP
status codes for the category of failure (`400` for a malformed request,
`401`/`403` for auth, `404` for missing, `409` for conflict, `429` for rate
limiting, `5xx` for your fault) — don't return `200` with an error payload
inside it, which forces every client to parse the body just to find out if
the call succeeded.

## Transport security

TLS everywhere, no exceptions for "internal" traffic — internal networks
get breached too. Never put secrets (API keys, tokens) in a URL's query
string: query strings routinely end up in server access logs, browser
history, and `Referer` headers sent to third parties. Put credentials in
headers or the request body instead.

TLS itself isn't free — a full handshake costs an extra round trip or two
before the first byte of real data moves (TLS 1.2 needs two round trips;
TLS 1.3 gets a full handshake down to one, and can resume a previous
session in zero). That cost is why connection reuse (keep-alive, HTTP/2
multiplexing many requests over one connection) matters as much for
latency as it does for throughput — paying the handshake cost once per
connection instead of once per request.

## Observability

Every response — success or failure — should carry a request id the caller
can hand back to you when reporting a problem, and every log line and
trace span on your side should carry that same id. Without it, "the API
returned an error at 3:47pm" is nearly unactionable; with it, it's a direct
lookup. The full three-signal model (metrics, logs, traces) this feeds
into is covered in
[Observability: Metrics, Logs, and Traces](/nuggets/observability).

## Documentation

Write the API contract down somewhere machine-readable (OpenAPI/Swagger is
the default choice) rather than only in prose or, worse, only in the
implementation. A machine-readable spec can generate client SDKs, drive
contract tests, and be diffed in code review to catch accidental breaking
changes — a paragraph in a wiki can't do any of that, and it drifts out of
sync with the code silently.

## Where to go from here

None of this is exotic — it's the same handful of concerns showing up on
every API that survives contact with real traffic. Treat this guide as a
checklist to run through when starting a new API or reviewing someone
else's, and follow the links above when you need the full depth on any one
topic.
