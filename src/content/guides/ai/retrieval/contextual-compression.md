## Contextual Compression

Standard RAG retrieves fixed-size chunks and feeds them to the LLM verbatim. A 512-token chunk retrieved for the query "What is the CEO's compensation?" might contain 480 tokens about board structure, company history, and legal boilerplate — only 30 tokens actually answer the question.

Contextual compression extracts only the relevant portion of each retrieved chunk before passing it to the generation model, reducing noise and context window usage.

## Extractive Compression

```python
import anthropic

client = anthropic.Anthropic()

def compress_chunk(query: str, chunk: str) -> str | None:
    """
    Extract the portion of chunk relevant to query.
    Returns None if chunk contains nothing relevant.
    """
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",   # Use fast/cheap model for compression
        max_tokens=256,
        messages=[{
            "role": "user",
            "content": f"""Extract only the portions of the document that are relevant to answering the query.
If the document contains nothing relevant, respond with exactly: IRRELEVANT

Query: {query}

Document:
{chunk}

Extracted relevant content:"""
        }]
    )

    result = response.content[0].text.strip()
    if result == "IRRELEVANT":
        return None
    return result


def retrieve_and_compress(
    query: str,
    retriever,
    top_k: int = 10,
    max_chunks: int = 5
) -> list[str]:
    """Retrieve broadly, compress and filter, return compact context."""
    raw_chunks = retriever.search(query, top_k=top_k)

    compressed = []
    for chunk in raw_chunks:
        result = compress_chunk(query, chunk.text)
        if result is not None:
            compressed.append(result)
        if len(compressed) >= max_chunks:
            break

    return compressed
```

## Compression Strategies

**Extractive** (shown above): use an LLM to pull out relevant sentences verbatim. Fast, preserves exact wording.

**Abstractive**: summarize the chunk conditioned on the query. Better when the relevant info is spread across the chunk.

**LLMLingua / Selective Token Pruning**: a trained small model scores token importance and drops low-scoring tokens. Achieves 2–10× compression with <5% quality loss on benchmarks. Works without a separate LLM call.

```python
from llmlingua import PromptCompressor

compressor = PromptCompressor(
    model_name="microsoft/llmlingua-2-bert-base-multilingual-cased-meetingbank"
)

compressed = compressor.compress_prompt(
    context="\n\n".join(retrieved_chunks),
    instruction=query,
    target_token=512           # Compress to 512 tokens regardless of input length
)
print(compressed["compressed_prompt"])
```

## Impact on Generation Quality

| Context strategy | Context tokens | ROUGE-L | Answer accuracy |
|----------------|---------------|---------|----------------|
| Raw chunks (top-5) | 2,560 | 0.41 | 76% |
| Extractive compression | 420 | 0.46 | 81% |
| LLMLingua (5×) | 512 | 0.44 | 79% |
| Gold (oracle) | 280 | 0.52 | 89% |

Compression improves both quality and cost. Less context means:
- Lower input token cost
- Faster TTFT
- Less attention dilution across irrelevant text
- Better performance on models with limited context adherence
