## What is RAG?

RAG (Retrieval-Augmented Generation) fetches relevant external data and puts it in the prompt before the model answers, so the response is grounded in retrieved facts rather than the model's training-time memory.

```
User Query ──> Embed ──> Vector Search ──> Retrieved Context
                                                  │
                                                  ▼
                                         LLM (Query + Context)
                                                  │
                                                  ▼
                                          Grounded Response
```

That flow is the *standard* RAG pipeline; you can [step through it interactively](/interactive/standard). [The RAG Pipeline](/guides/rag-pipeline) breaks down each stage.

## Why Use RAG?

| Benefit | Detail |
|---------|--------|
| **Reduced hallucinations** | Answers grounded in facts, not training guesses |
| **Up-to-date knowledge** | Access current data without retraining |
| **Source attribution** | Cite original documents for verification |
| **Data privacy** | Keep proprietary data in your own vector database |
| **Cost-effective** | Far cheaper than fine-tuning for factual recall |

## RAG vs Alternatives

| Approach | Cost | Update Time | Best For |
|----------|------|-------------|----------|
| **RAG** | $ | Minutes | Dynamic knowledge, large corpora |
| **Fine-tuning** | $$$$ | Days–weeks | New behaviors, tone, style |
| **Long context** | $$ | Immediate | <100 docs, full-doc reasoning |

**Rule of thumb:** Frequently changing data → RAG. Teaching new behavior → fine-tuning. Small doc set → long context. Best results often combine RAG + fine-tuning.

## Key Concepts

**Embeddings** — Text converted to numerical vectors that capture meaning. Similar text produces similar vectors.
```
"cat"    → [0.2, 0.5, -0.1, ...]   ← close to "kitten"
"car"    → [-0.3, 0.1, 0.8, ...]   ← far from "cat"
```

**Vector search** — Finds semantically similar content, not just keyword matches.
```
Query: "fix authentication error"
Also finds: "login problems", "credential issues", "auth debugging"
```

**Context window** — LLM's text limit. RAG retrieves only the relevant slice of a large knowledge base to fit.

## When to Use RAG

**Good fit:** Customer support knowledge bases, documentation Q&A, internal search, research assistants, anything with frequently updated facts.

**Poor fit:** Creative writing, general conversation, real-time APIs (use function calling instead), datasets small enough to fit in context.
