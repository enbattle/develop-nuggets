## Cost Optimization for AI Systems

Smart optimization can reduce AI costs 50–80% without sacrificing quality.

## Cost Breakdown

```
API Calls (LLM)     60%  ████████████
Compute (GPU/CPU)   20%  ████
Storage             10%  ██
Data Transfer        5%  █
Monitoring           5%  █
```

LLM API calls dominate. Focus optimization there first.

## 1. Response Caching

Avoid redundant API calls for identical or near-identical queries.

```python
import hashlib, json
from datetime import datetime, timedelta

class ResponseCache:
    def __init__(self, ttl_seconds: int = 3600):
        self.cache = {}
        self.ttl = timedelta(seconds=ttl_seconds)

    def _key(self, prompt: str, model: str) -> str:
        return hashlib.sha256(f"{model}:{prompt}".encode()).hexdigest()

    def get(self, prompt: str, model: str):
        key = self._key(prompt, model)
        if key in self.cache:
            entry = self.cache[key]
            if datetime.now() - entry["time"] < self.ttl:
                return entry["response"]
            del self.cache[key]
        return None

    def set(self, prompt: str, model: str, response: str):
        self.cache[self._key(prompt, model)] = {"response": response, "time": datetime.now()}

# Usage
cache = ResponseCache(ttl_seconds=3600)

def cached_query(prompt: str, model: str) -> str:
    if cached := cache.get(prompt, model):
        return cached
    response = llm.generate(prompt, model)
    cache.set(prompt, model, response)
    return response
```

## 2. Model Tiering

Use cheaper models for simple tasks, expensive models only for complex ones.

```python
import anthropic

class TieredModelSelector:
    def __init__(self):
        self.client = anthropic.Anthropic()
        self.models = {
            "fast":     "claude-haiku-4-5-20251001",   # Cheapest, fastest
            "balanced": "claude-sonnet-4-6",            # Best value
            "powerful": "claude-opus-4-8",              # Most capable
        }

    def classify_complexity(self, query: str) -> str:
        word_count = len(query.split())
        has_math = any(op in query for op in ["+", "-", "*", "/", "calculate"])
        is_creative = any(w in query.lower() for w in ["write", "create", "generate", "story"])

        if word_count < 20 and not has_math and not is_creative:
            return "fast"
        elif word_count > 100 or is_creative:
            return "powerful"
        return "balanced"

    def query(self, prompt: str) -> tuple[str, str]:
        tier = self.classify_complexity(prompt)
        model = self.models[tier]
        response = self.client.messages.create(
            model=model, max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text, tier
```

## 3. Prompt Compression

Reduce token count without losing critical information.

```python
def compress_context(docs: list[str], query: str, max_tokens: int = 2000) -> str:
    """Summarize retrieved documents to fit within token budget."""
    full_context = "\n\n".join(docs)

    if estimate_tokens(full_context) <= max_tokens:
        return full_context

    # Summarize to fit budget
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",   # Use cheap model for compression
        max_tokens=max_tokens,
        messages=[{
            "role": "user",
            "content": f"Summarize the most relevant parts for answering: '{query}'\n\nDocuments:\n{full_context}"
        }]
    )
    return response.content[0].text
```

For cost optimization — batch processing, prompt caching, model tiering, and per-request cost tracking — see the **AI Cost Optimization** lesson in this node.
