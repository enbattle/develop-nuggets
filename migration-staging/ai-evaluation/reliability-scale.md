## Reliability & Scale for AI Systems

Building AI that stays up, stays fast, and handles load.

## The Four Pillars

```
FAULT TOLERANCE     PERFORMANCE      SCALABILITY      AVAILABILITY
Handle failures     Low latency      Handle load      Always up

Retries             Caching          Auto-scaling     99.9% SLA
Fallbacks           Parallelism      Load balancing   Redundancy
Circuit breaker     Streaming        Queuing          Failover
```

## 1. Retry Logic with Exponential Backoff

```python
import time, random
import anthropic
from anthropic import RateLimitError, APIError

def query_with_retry(prompt: str, max_retries: int = 3) -> str:
    client = anthropic.Anthropic()
    last_error = None

    for attempt in range(max_retries):
        try:
            response = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text

        except RateLimitError as e:
            wait = (2 ** attempt) + random.uniform(0, 1)   # Exponential backoff with jitter
            print(f"Rate limited. Waiting {wait:.1f}s (attempt {attempt + 1}/{max_retries})")
            time.sleep(wait)
            last_error = e

        except APIError as e:
            if e.status_code in [500, 502, 503]:   # Retryable server errors
                time.sleep(2 ** attempt)
                last_error = e
            else:
                raise   # Non-retryable (400, 401, 404)

    raise last_error
```

## 2. Circuit Breaker

Stop hammering a failing service — fail fast and recover gracefully.

```python
from enum import Enum
from datetime import datetime, timedelta

class CircuitState(Enum):
    CLOSED = "closed"       # Normal operation
    OPEN = "open"           # Failing — reject requests
    HALF_OPEN = "half_open" # Testing recovery

class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, recovery_timeout: int = 60):
        self.state = CircuitState.CLOSED
        self.failures = 0
        self.threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.last_failure = None

    def call(self, fn, *args, **kwargs):
        if self.state == CircuitState.OPEN:
            if datetime.now() - self.last_failure > timedelta(seconds=self.recovery_timeout):
                self.state = CircuitState.HALF_OPEN
            else:
                raise Exception("Circuit open — service unavailable")

        try:
            result = fn(*args, **kwargs)
            if self.state == CircuitState.HALF_OPEN:
                self.reset()
            return result
        except Exception as e:
            self.record_failure()
            raise

    def record_failure(self):
        self.failures += 1
        self.last_failure = datetime.now()
        if self.failures >= self.threshold:
            self.state = CircuitState.OPEN

    def reset(self):
        self.failures = 0
        self.state = CircuitState.CLOSED
```

## 3. Parallel Processing

```python
import asyncio

async def parallel_rag(queries: list[str]) -> list[str]:
    """Process multiple queries concurrently."""
    async def query_one(q: str) -> str:
        # Your async RAG implementation
        return await rag.async_query(q)

    return await asyncio.gather(*[query_one(q) for q in queries])

# Sequential: 10 queries × 2s = 20s
# Parallel:   10 queries → max(2s each) ≈ 2-3s
```

## 4. Load Balancing

```python
import itertools

class LoadBalancer:
    def __init__(self, endpoints: list[str]):
        self.endpoints = endpoints
        self.health = {ep: True for ep in endpoints}
        self._cycle = itertools.cycle(endpoints)

    def get_healthy_endpoint(self) -> str:
        """Round-robin over healthy endpoints."""
        for _ in range(len(self.endpoints)):
            ep = next(self._cycle)
            if self.health[ep]:
                return ep
        raise Exception("No healthy endpoints")

    def mark_unhealthy(self, endpoint: str):
        self.health[endpoint] = False
        # Schedule recovery check
```

## 5. Graceful Degradation

When primary system fails, fall back to a simpler response:

```python
class ResilientRAG:
    def query(self, question: str) -> dict:
        # Try full RAG pipeline
        try:
            docs = self.retrieve(question)
            answer = self.generate(question, docs)
            return {"answer": answer, "source": "rag", "docs": docs}
        except Exception as e:
            log_error(e)

        # Fallback: try without retrieval (LLM only)
        try:
            answer = self.llm_only(question)
            return {"answer": answer, "source": "llm_fallback", "docs": []}
        except Exception as e:
            log_error(e)

        # Final fallback: static message
        return {
            "answer": "I'm currently experiencing issues. Please try again shortly.",
            "source": "static_fallback",
            "docs": []
        }
```

## SLA Targets

| Metric | Target | P1 Alert |
|--------|--------|----------|
| Availability | 99.9% (8.7h downtime/year) | <99% |
| p50 latency | <500ms | >1s |
| p95 latency | <2s | >5s |
| p99 latency | <5s | >10s |
| Error rate | <0.1% | >1% |
