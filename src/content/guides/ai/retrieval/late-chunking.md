## Late Chunking

Standard [chunking](/guides/chunking-strategies) embeds each text segment independently, so a chunk's embedding has no knowledge of its surroundings: "the company" in paragraph 3 doesn't know who "the company" was in paragraph 1.

Late chunking inverts the order: embed the full document first, then split the resulting embeddings into chunk-level representations. Each token's embedding already encodes its position within the full document context, so the chunk-level vectors carry cross-document semantic information.

## The Core Operation

```python
import voyageai
import numpy as np

voy = voyageai.Client()

def late_chunk_embed(text: str, chunk_size: int = 512) -> list[np.ndarray]:
    """
    1. Embed the full document to get token-level embeddings
    2. Mean-pool over each chunk's token range
    """
    # Get token-level embeddings (not pooled to a single vector)
    result = voy.embed(
        [text],
        model="voyage-4-large",
        output_type="per-token"     # Token-level vectors, not document-level
    )
    token_embeddings = np.array(result.embeddings[0])  # (n_tokens, dim)

    # Tokenize to find chunk boundaries
    tokens = voy.tokenize([text])[0]
    chunk_vecs = []

    for start in range(0, len(tokens), chunk_size):
        end = min(start + chunk_size, len(tokens))
        chunk_vec = token_embeddings[start:end].mean(axis=0)
        chunk_vecs.append(chunk_vec)

    return chunk_vecs    # Each vector is context-aware
```

## Why It Works

Consider this document:
> "Acme Corp was founded in 1984. The company is headquartered in Austin."

Standard chunking might split after "1984." The second chunk "The company is headquartered in Austin" produces an embedding for "the company" with no referent — just an abstract entity.

Late chunking embeds the full text, so "company" in chunk 2 has attention over "Acme Corp" in chunk 1. The resulting chunk-2 embedding is effectively grounded in the entity from chunk 1.

## Performance vs. Standard Chunking

On the LoCo (Long Context) benchmark:

| Method | Retrieval recall@10 |
|--------|-------------------|
| Standard chunking (512 tok) | 67.2% |
| Overlapping chunks (50% overlap) | 71.8% |
| Late chunking | 79.4% |

The gain is largest on documents with high cross-sentence coreference: legal contracts, technical manuals, narrative reports.

## Trade-offs

| Property | Standard chunking | Late chunking |
|----------|-----------------|--------------|
| Context awareness | None | Full document |
| Compute cost | O(chunks) | O(document) — more expensive |
| Memory at embed time | Low | Full document in memory |
| Index size | Same | Same (same chunk count) |
| Best for | Short, self-contained chunks | Reference-heavy documents |

Late chunking costs more at indexing time but produces the same-size index as standard chunking. Retrieval is identical in cost — only indexing is affected.
