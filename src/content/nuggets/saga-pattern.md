## What it is

A **saga** coordinates a business operation that spans multiple
services — each with its own database — as a sequence of local
transactions, each with a defined **compensating transaction** that
undoes it if a later step fails. There's no distributed transaction
wrapping the whole thing; instead, correctness comes from being able to
unwind whatever already happened.

## Why it matters

A single-database transaction gives you atomicity for free — either
everything commits or nothing does. Once an operation spans services
(each owning its own data), there's no shared transaction coordinator
that can offer the same guarantee without unacceptable availability
cost (see [CAP Theorem](/nuggets/cap-theorem) and why two-phase commit
falls out of favor at scale). A saga accepts that intermediate states
are real and briefly visible, and designs explicitly for how to recover
if a later step fails.

## Example: booking a trip

```mermaid
flowchart LR
    A["Reserve flight"] --> B["Reserve hotel"]
    B --> C["Charge card"]
    C -->|fails| D["Compensate: refund"]
    D --> E["Compensate: cancel hotel"]
    E --> F["Compensate: cancel flight"]
```

If charging the card fails after the flight and hotel are already
reserved, the saga runs compensating actions in reverse — cancel the
hotel, cancel the flight — rather than leaving two paid-for reservations
behind with no successful booking to show for them.

## Orchestration vs. choreography

- **Orchestration** — a central coordinator explicitly calls each step
  and decides what to do on failure. Easier to follow and test (the
  whole flow lives in one place), at the cost of a new central
  component.
- **Choreography** — each service reacts to events from the previous
  one (via a broker) and emits its own event when done, with no central
  coordinator. No single point of control, but the overall flow is
  implicit — reconstructing "what happens when payment fails" means
  tracing event handlers across every service.

## Where it applies

Any multi-service operation with no shared database — order fulfillment
(reserve inventory → charge payment → schedule shipping), travel
booking, account provisioning across multiple systems. Publishing each
step's outcome reliably, so the next step (or a compensation) actually
fires, is exactly the problem the
[Outbox Pattern](/nuggets/outbox-pattern) solves — sagas are usually
built on top of it, not instead of it.

## Key insight

A saga doesn't prevent an operation from being seen mid-flight (someone
can see a flight reserved with no hotel yet) — it accepts that as
unavoidable once state is split across services, and its whole design
is about *always* having a way back out if a later step fails, rather
than trying to hide the intermediate state.
