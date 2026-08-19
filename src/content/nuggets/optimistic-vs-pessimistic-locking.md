## What it is

Two strategies for handling concurrent writes to the same data without
corrupting it. **Pessimistic locking** assumes conflicts are likely and
prevents them up front — acquire a lock before touching the data, so no
one else can write to it until you're done. **Optimistic locking**
assumes conflicts are rare — let everyone proceed without locking, but
detect a conflict at write time and reject (or retry) whichever write
loses the race.

## Pessimistic locking

```sql
BEGIN;
SELECT * FROM inventory WHERE product_id = 42 FOR UPDATE; -- blocks other writers
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 42;
COMMIT;
```

`SELECT ... FOR UPDATE` holds a row lock until the transaction commits —
any other transaction trying to update (or lock) the same row blocks
until this one finishes. Safe by construction, but a slow or stuck
transaction holds up everyone waiting behind it, and it doesn't work at
all across services that don't share a database.

## Optimistic locking

Instead of locking, add a version column and check it hasn't changed
since you read it:

```sql
UPDATE inventory
SET quantity = quantity - 1, version = version + 1
WHERE product_id = 42 AND version = 7; -- the version we read
-- 0 rows affected → someone else updated it first; re-read and retry
```

No lock is ever held, so throughput under low contention is much
better — but under high contention, many writers can retry repeatedly
(each one's write invalidated by the next), which can be worse than
just queuing behind a lock in the first place.

## Choosing between them

Pessimistic locking wins when conflicts are frequent and retrying is
expensive (a multi-step checkout that's costly to redo). Optimistic
locking wins when conflicts are rare and most attempts succeed on the
first try — which describes the majority of real-world write patterns,
which is why optimistic locking (or a database's own MVCC, a form of
it) is the more common default.

## Where it applies

Any concurrent update to shared state: inventory counts, seat
reservations, account balances, collaborative document edits. It's also
the same underlying concern [Idempotency](/nuggets/idempotency)
addresses from a different angle — idempotency makes a *retried*
request safe, while locking strategy determines what happens when two
*different, concurrent* requests touch the same data at once.

## Key insight

Locking is a bet about how often conflicts actually happen: pessimistic
pays a cost on every write to guarantee safety, optimistic pays no cost
on the common case but a real cost when contention is higher than
assumed. Guess wrong and either throughput suffers unnecessarily, or
retries pile up under load.
