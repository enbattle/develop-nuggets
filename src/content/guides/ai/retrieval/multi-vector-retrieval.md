## Multi-Vector Retrieval

Standard embedding models compress an entire query or document into a single vector. Multi-vector retrieval keeps one embedding **per token**, then scores query–document pairs with fine-grained token alignment. This preserves semantic detail that single-vector compression inevitably loses.

## ColBERT: Token-Level Interaction

ColBERT (Contextualized Late Interaction over BERT) generates one embedding per token, then scores relevance using **MaxSim**: for each query token, find the highest cosine similarity to any document token, then sum.

```
Query: ["What", "is", "the", "capital", "of", "France?"]
             ↓        ↓      ↓       ↓         ↓       ↓
       [q₁]   [q₂]  [q₃]  [q₄]   [q₅]    [q₆]   ← 128-dim each

Document: ["Paris", "is", "the", "capital", "and", "largest", "city", "of", "France"]
              ↓       ↓     ↓       ↓         ↓       ↓         ↓      ↓      ↓
           [d₁]   [d₂] [d₃]  [d₄]  [d₅]  [d₆]   [d₇]   [d₈]  [d₉]   ← 128-dim each

MaxSim score = Σᵢ max_j(qᵢ · dⱼ)
  q₄("capital") aligns strongly with d₄("capital") → high contribution
  q₆("France?") aligns strongly with d₉("France") → high contribution
```

```python
from ragatouille import RAGPretrainedModel

# RAGatouille wraps ColBERT for end-to-end use
rag = RAGPretrainedModel.from_pretrained("colbert-ir/colbertv2.0")

# Index a corpus
rag.index(
    collection=documents,
    index_name="my_collection",
    max_document_length=256,
    split_documents=True
)

# Retrieve
results = rag.search(query="What caused the 2008 financial crisis?", k=5)
# Returns documents with fine-grained ColBERT scores
```

## ColPali: Visual Page Retrieval

ColPali extends the multi-vector idea to **PDF pages and images**. Instead of text tokens, it generates one embedding per image patch (from a ViT), then uses MaxSim to align query tokens with visual patches. No OCR required.

```python
from colpali_engine.models import ColPali, ColPaliProcessor
from PIL import Image
import torch

model = ColPali.from_pretrained("vidore/colpali-v1.2", torch_dtype=torch.bfloat16)
processor = ColPaliProcessor.from_pretrained("vidore/colpali-v1.2")

# Embed a PDF page (as image)
page_img = Image.open("report_page_12.png")
page_inputs = processor.process_images([page_img])
with torch.no_grad():
    page_embeddings = model(**page_inputs)  # (1, num_patches, dim)

# Embed a query
query_inputs = processor.process_queries(["What was the revenue growth in Q3?"])
with torch.no_grad():
    query_embeddings = model(**query_inputs)  # (1, query_len, dim)

# MaxSim scoring
scores = model.score_multi_vector(query_embeddings, page_embeddings)
```

ColPali excels at slide decks, scanned reports, and any document where layout and figures carry meaning that text-only OCR would lose.

## Storage: Compressed Indexes

Multi-vector retrieval stores N vectors per document (N = token count or patch count). Storage grows proportionally. PLAID (ColBERT's production index) uses k-means centroids to compress token embeddings:

```
Naive:    1M docs × 256 tokens × 128 dims × 4 bytes = 131 GB
PLAID:    ~4 GB with <2% recall loss via centroid compression
```

## Comparison

| System | Vectors/doc | Relevance signal | Best for |
|--------|------------|-----------------|---------|
| Dense (single vector) | 1 | Coarse | Broad semantic match |
| Sparse (BM25) | N (term weights) | Term overlap | Keyword-heavy queries |
| ColBERT | N (token) | Fine-grained text | Nuanced language queries |
| ColPali | N (patch) | Visual layout | PDFs, charts, slides |

Use ColBERT when recall matters more than retrieval speed, or when queries are long and semantically complex. Use ColPali when your corpus includes visually rich PDFs or slide decks.
