## Monitoring & Observability for AI Systems

You cannot improve what you do not measure. Monitoring catches problems before users do.

## What to Monitor

```
Infrastructure Metrics          Model Quality Metrics
─────────────────────          ─────────────────────
Latency (p50, p95, p99)        Faithfulness score
Error rate                      Answer relevancy
Throughput (req/s)              User satisfaction (thumbs)
Memory / CPU usage              Hallucination rate
Cost per request                Context precision (RAG)
```

## Setting Up Metrics Collection

```python
import time, json, logging
from dataclasses import dataclass, asdict
from datetime import datetime

@dataclass
class RequestMetrics:
    request_id: str
    query: str
    response_length: int
    latency_ms: float
    model: str
    tokens_used: int
    timestamp: str

class MetricsCollector:
    def __init__(self, log_file: str):
        self.log_file = log_file
        logging.basicConfig(level=logging.INFO)

    def record(self, metrics: RequestMetrics):
        entry = asdict(metrics)
        logging.info(json.dumps(entry))
        with open(self.log_file, "a") as f:
            f.write(json.dumps(entry) + "\n")

# Wrap your inference function
collector = MetricsCollector("metrics.jsonl")

def monitored_query(query: str) -> str:
    start = time.time()
    response = rag.query(query)
    latency = (time.time() - start) * 1000

    collector.record(RequestMetrics(
        request_id=str(uuid.uuid4()),
        query=query[:100],
        response_length=len(response),
        latency_ms=latency,
        model="claude-sonnet-4-6",
        tokens_used=estimate_tokens(query + response),
        timestamp=datetime.now().isoformat()
    ))
    return response
```

## Alerting

```python
class AlertManager:
    def __init__(self):
        self.thresholds = {
            "error_rate": 0.05,         # Alert if >5% errors
            "p95_latency_ms": 3000,     # Alert if p95 >3s
            "faithfulness": 0.80,       # Alert if quality drops below 80%
        }

    def check_metrics(self, window_metrics: dict) -> list[str]:
        alerts = []

        if window_metrics["error_rate"] > self.thresholds["error_rate"]:
            alerts.append(f"🚨 High error rate: {window_metrics['error_rate']:.1%}")

        if window_metrics["p95_latency_ms"] > self.thresholds["p95_latency_ms"]:
            alerts.append(f"⚠️ High latency: {window_metrics['p95_latency_ms']}ms p95")

        if window_metrics.get("faithfulness", 1.0) < self.thresholds["faithfulness"]:
            alerts.append(f"⚠️ Quality drop: faithfulness {window_metrics['faithfulness']:.1%}")

        return alerts
```

## Distributed Tracing

Track a request across all components:

```python
import uuid

class TracedRAGPipeline:
    def query(self, user_query: str) -> dict:
        trace_id = str(uuid.uuid4())

        with self.tracer.span("embed_query", trace_id=trace_id) as span:
            q_embedding = self.embed_model.encode(user_query)
            span.set_attribute("input_length", len(user_query))

        with self.tracer.span("vector_search", trace_id=trace_id) as span:
            results = self.collection.query(query_embeddings=[q_embedding.tolist()], n_results=5)
            span.set_attribute("docs_retrieved", len(results['documents'][0]))

        with self.tracer.span("llm_generation", trace_id=trace_id) as span:
            answer = self.generate(user_query, results['documents'][0])
            span.set_attribute("answer_length", len(answer))

        return {"answer": answer, "trace_id": trace_id}
```

## User Feedback Collection

```python
# Simple thumbs up/down
def collect_feedback(query_id: str, rating: int):   # rating: 1 or -1
    entry = {
        "query_id": query_id,
        "rating": rating,
        "timestamp": datetime.now().isoformat()
    }
    with open("feedback.jsonl", "a") as f:
        f.write(json.dumps(entry) + "\n")

# Analyze feedback
def satisfaction_rate(feedback_file: str, window_days: int = 7) -> float:
    cutoff = datetime.now() - timedelta(days=window_days)
    ratings = []
    with open(feedback_file) as f:
        for line in f:
            entry = json.loads(line)
            if datetime.fromisoformat(entry["timestamp"]) > cutoff:
                ratings.append(entry["rating"])
    return sum(1 for r in ratings if r > 0) / len(ratings) if ratings else 0
```

## Dashboard Metrics to Track Daily

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| Error rate | Log analysis | >2% |
| p95 Latency | Metrics store | >3s |
| User satisfaction | Feedback DB | <75% |
| Cost/request | API billing | >2x baseline |
| Faithfulness | Weekly eval | <85% |
