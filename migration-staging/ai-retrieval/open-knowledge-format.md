## Open Knowledge Format (OKF)

Vector RAG re-derives knowledge at query time from raw text chunks. OKF inverts
this: curated, cross-linked concepts are written down once in structured files
and loaded directly into agent context — no embedding, no retrieval.

Google Cloud published the OKF specification in June 2026. A bundle is a
directory of Markdown files, each describing one concept with YAML frontmatter
and a prose body that can cross-link to other concepts in the bundle.

## Bundle Structure

```
knowledge/
  _index.yaml          # bundle metadata (title, version, entry points)
  concepts/
    vector-search.md   # one concept per file
    chunking.md
    reranking.md
  guides/
    production-rag.md  # longer how-to documents
```

Each concept file has YAML frontmatter followed by a Markdown body:

```markdown
---
okf_type: concept
title: Vector Search
description: Approximate nearest neighbor search over embedding vectors.
resource_uri: knowledge://concepts/vector-search
tags: [retrieval, embeddings, hnsw]
related:
  - knowledge://concepts/chunking
  - knowledge://concepts/reranking
---

# Vector Search

Vector search finds semantically similar content by comparing embedding vectors
using approximate nearest neighbor (ANN) algorithms such as HNSW...
```

## OKF vs. Vector RAG

| | OKF Bundle | Vector RAG |
|---|---|---|
| **Knowledge source** | Curated by humans | Chunked from raw documents |
| **Retrieval** | Direct load (no search) | ANN similarity search |
| **Update cost** | Edit a single file | Re-chunk + re-embed affected docs |
| **Relational links** | Explicit cross-references | Implicit (via embedding proximity) |
| **Best for** | Stable, structured, relational knowledge | Large, unstructured, frequently queried corpora |
| **Worst for** | Large or rapidly changing corpora | Small stable knowledge bases |

## When OKF Wins

OKF is the better choice when knowledge is:

- **Structured and relational** — metrics definitions, API docs, runbooks, schemas
- **Small-to-medium corpus** — a few hundred concepts that an agent needs reliably
- **Stable** — content changes infrequently; maintaining embeddings is overkill
- **Authority-sensitive** — you need to guarantee the agent reads *your* definition, not a retrieved approximation

## Combining OKF and Vector RAG

The most robust production architectures use both:

1. **OKF layer** — curated concepts and glossary that agents always have in context
2. **Vector RAG layer** — unstructured documents for long-tail queries that the OKF bundle doesn't cover
3. **Bonus:** Index the OKF bundle itself as source material for the RAG index — structured, well-written concepts make better retrieval chunks than raw prose

```python
import yaml
from pathlib import Path

def load_okf_bundle(bundle_dir: str) -> dict[str, str]:
    """Load all OKF concept files into {uri: content} dict."""
    concepts: dict[str, str] = {}
    for md_file in Path(bundle_dir).rglob('*.md'):
        text = md_file.read_text()
        # Parse YAML frontmatter
        if text.startswith('---'):
            _, fm, body = text.split('---', 2)
            meta = yaml.safe_load(fm)
            uri = meta.get('resource_uri', str(md_file))
            concepts[uri] = body.strip()
    return concepts

def build_okf_context(bundle_dir: str, relevant_uris: list[str]) -> str:
    """Select specific concepts to inject into agent context."""
    bundle = load_okf_bundle(bundle_dir)
    sections = []
    for uri in relevant_uris:
        if uri in bundle:
            sections.append(f'## {uri}
{bundle[uri]}')
    return '

'.join(sections)

# Usage: inject relevant OKF concepts as system context
okf_context = build_okf_context(
    './knowledge',
    ['knowledge://concepts/vector-search', 'knowledge://concepts/reranking']
)
```
