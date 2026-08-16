## What it is

SemVer: a version number format `MAJOR.MINOR.PATCH` (e.g. `2.4.1`) where
each part signals a specific kind of change — **MAJOR** for a breaking
change, **MINOR** for new backwards-compatible functionality, **PATCH**
for a backwards-compatible bug fix.

## Why it matters

A version number is a promise, not just a label. If consumers can trust
that a MINOR or PATCH bump never breaks them, they can upgrade freely
without reading every changelog. If MAJOR bumps are the _only_ ones that
can break them, they know exactly when to budget time for a migration.
Break that promise once — a breaking change hidden in a patch release —
and consumers stop trusting version numbers at all, which defeats the
entire point of having them.

## The rules, briefly

- **MAJOR** — any backwards-incompatible change: a removed or renamed
  field, changed behavior, dropped support for something.
- **MINOR** — new, backwards-compatible functionality: a new optional
  field, a new endpoint, a new opt-in parameter.
- **PATCH** — a backwards-compatible bug fix, with no new functionality.
- **`0.x.y`** — by convention, anything can change at any version bump
  before `1.0.0`. Don't rely on stability from a pre-1.0 package.

## Where it applies

Published packages and libraries (npm, PyPI, and most other registries
follow SemVer), public APIs, and internal shared libraries consumed by
other teams — anywhere something is versioned and used by code you don't
control.

## Key insight

SemVer is a communication protocol between a maintainer and their
consumers, not a checklist to satisfy after the fact. The actual
discipline is deciding _before_ shipping whether a change is genuinely
backwards-compatible — that decision is what determines which number to
bump, not the other way around.
