Blob storage (S3 and similar) stores arbitrary binary objects at
massive scale, and its object model is deliberately simpler than a
filesystem's — that simplicity is exactly what lets it scale the way it
does.

## The object model

Everything is a **bucket** (a top-level namespace) containing
**objects**, each addressed by a flat **key** — there's no real
directory structure underneath, even though keys with `/` in them
(`photos/2024/summer.jpg`) are commonly displayed *as if* there were
one:

```
bucket: user-uploads
  key: user-42/avatar.jpg
  key: user-42/documents/resume.pdf
  key: user-88/avatar.jpg
```

`documents/` isn't a real folder — it's just part of the key string.
This flat model is what makes blob storage horizontally scalable in a
way a traditional hierarchical filesystem isn't: there's no directory
inode that every write inside it has to update, so writes to unrelated
keys never contend with each other regardless of how "nested" their
keys look.

## What it's for (and not for)

Blob storage is built for storing and retrieving whole objects by key —
not for partial in-place updates (changing a byte range inside an
existing object generally means rewriting the whole object), not for
low-latency small reads (it trades some latency for durability and
scale — see [Numbers Every Engineer Should Know](/nuggets/numbers-every-engineer-should-know)
for roughly where it sits relative to a database or cache read), and
not for complex querying (there's no index on object *contents*, only
on the key). It's the right tool for exactly what a database row is the
wrong tool for: large binary content — images, video, backups, log
archives, ML model files.

## Uploading and serving without a bottleneck

Routing large files through an application server wastes exactly the
resource a stateless app server should be scaling independently of file
size — see
[Handling Large File Uploads](/nuggets/large-file-uploads) for the
presigned-URL pattern that lets a client upload directly to blob
storage, with the app server only issuing short-lived permission. The
same idea applies in reverse for downloads: a presigned URL or, for
anything served to many readers, a [CDN](/guides/cdn) in front of the
bucket, rather than proxying every download through the app.

## Durability and storage classes

Object storage services typically offer tiered storage classes trading
retrieval latency for cost — a "standard" tier for frequently-accessed
objects, down to "archive" tiers (minutes-to-hours retrieval time) for
data that's rarely read but must be retained (compliance archives, old
backups). Choosing the wrong tier for an access pattern is a common,
avoidable cost mistake — archival pricing looks great until something
in that tier needs to be read urgently.

## Where it applies

User-uploaded content, static website assets, data lake storage, backup
and archival, and as the durable landing zone for anything a
[long-running task](/nuggets/long-running-tasks) produces as output.

## Key insight

Blob storage's flat key/object model is a deliberate simplification
that trades filesystem-like features (partial updates, real
directories, low-latency small reads) for horizontal scale and
durability at a size a traditional filesystem was never built for.
