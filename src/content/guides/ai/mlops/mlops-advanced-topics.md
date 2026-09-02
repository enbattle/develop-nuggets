Five patterns that show up once an AI system is large enough to need them — not before.

## 1. Feature Stores

Centralized repository for ML features — ensures consistency between training and inference.

```python
from datetime import datetime
from typing import Any

class FeatureStore:
    """Store and serve ML features with versioning."""

    def __init__(self, db_connection):
        self.db = db_connection
        self._cache = {}

    def store_feature(self, entity_id: str, feature_name: str,
                     value: Any, version: str = "latest"):
        self.db.execute("""
            INSERT INTO features (entity_id, feature_name, value, version, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (entity_id, feature_name, json.dumps(value), version, datetime.now()))

    def get_feature(self, entity_id: str, feature_name: str,
                   version: str = "latest") -> Any:
        cache_key = f"{entity_id}:{feature_name}:{version}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        result = self.db.execute("""
            SELECT value FROM features
            WHERE entity_id = ? AND feature_name = ? AND version = ?
            ORDER BY created_at DESC LIMIT 1
        """, (entity_id, feature_name, version)).fetchone()

        if result:
            value = json.loads(result[0])
            self._cache[cache_key] = value
            return value
        return None
```

Feature stores ensure the same feature computation logic runs in both training pipelines and production inference.

## 2. Online Learning

Update models continuously from production feedback:

```python
import threading, queue

class OnlineLearningSystem:
    def __init__(self):
        self.feedback_queue = queue.Queue()
        self.update_threshold = 100  # Retrain after 100 feedback samples
        threading.Thread(target=self._training_loop, daemon=True).start()

    def collect_feedback(self, query: str, response: str, rating: int):
        """Collect feedback from production."""
        self.feedback_queue.put({
            "query": query,
            "response": response,
            "rating": rating,
            "timestamp": datetime.now().isoformat()
        })

    def _training_loop(self):
        buffer = []
        while True:
            try:
                feedback = self.feedback_queue.get(timeout=60)
                buffer.append(feedback)

                if len(buffer) >= self.update_threshold:
                    self._trigger_retraining(buffer)
                    buffer = []
            except queue.Empty:
                continue

    def _trigger_retraining(self, feedback_data: list):
        """Trigger model update with recent feedback."""
        positive = [f for f in feedback_data if f["rating"] > 0]
        negative = [f for f in feedback_data if f["rating"] < 0]
        print(f"Retraining on {len(positive)} positive, {len(negative)} negative examples")
        # Trigger training pipeline
```

## 3. Multi-Region Deployment

```python
REGIONS = {
    "us-east": {"endpoint": "api-us-east.example.com", "latency_ms": 50},
    "eu-west": {"endpoint": "api-eu.example.com", "latency_ms": 150},
    "ap-south": {"endpoint": "api-ap.example.com", "latency_ms": 200},
}

def get_nearest_region(user_ip: str) -> str:
    """Route user to nearest healthy region."""
    user_region = geoip.lookup(user_ip)
    healthy_regions = [r for r, config in REGIONS.items() if health_check(config["endpoint"])]

    if not healthy_regions:
        raise Exception("All regions unavailable")

    return min(healthy_regions, key=lambda r: REGIONS[r]["latency_ms"])

class MultiRegionClient:
    def query(self, prompt: str, user_ip: str) -> str:
        region = get_nearest_region(user_ip)
        endpoint = REGIONS[region]["endpoint"]

        try:
            return self._query_endpoint(endpoint, prompt)
        except Exception:
            # Failover to next nearest
            fallback = next(r for r in REGIONS if r != region)
            return self._query_endpoint(REGIONS[fallback]["endpoint"], prompt)
```

## 4. Chaos Engineering

Proactively test failure scenarios before they happen in production:

```python
import random

class ChaosMonkey:
    """Inject controlled failures to test system resilience."""

    def __init__(self, failure_rate: float = 0.1):
        self.failure_rate = failure_rate  # 10% of requests
        self.enabled = os.environ.get("CHAOS_ENABLED", "false") == "true"

    def wrap(self, fn):
        def wrapper(*args, **kwargs):
            if self.enabled and random.random() < self.failure_rate:
                chaos_type = random.choice(["timeout", "error", "slow"])

                if chaos_type == "timeout":
                    raise TimeoutError("Simulated timeout")
                elif chaos_type == "error":
                    raise RuntimeError("Simulated service error")
                elif chaos_type == "slow":
                    time.sleep(random.uniform(2, 5))

            return fn(*args, **kwargs)
        return wrapper

# Enable only in staging: CHAOS_ENABLED=true
chaos = ChaosMonkey(failure_rate=0.1)
resilient_query = chaos.wrap(rag.query)
```

## 5. Cost Anomaly Detection

```python
def detect_cost_anomaly(recent_costs: list[float], baseline_costs: list[float]) -> bool:
    """Alert if costs spike significantly above baseline."""
    from scipy import stats

    # Z-score comparison
    recent_mean = sum(recent_costs) / len(recent_costs)
    baseline_mean = sum(baseline_costs) / len(baseline_costs)
    baseline_std = (sum((x - baseline_mean) ** 2 for x in baseline_costs) / len(baseline_costs)) ** 0.5

    z_score = (recent_mean - baseline_mean) / max(baseline_std, 0.001)
    return z_score > 3  # Alert if >3 standard deviations above baseline

# Run daily
def daily_cost_check():
    today_costs = get_costs(days=1)
    last_30d_costs = get_costs(days=30)
    if detect_cost_anomaly(today_costs, last_30d_costs):
        alert("Cost anomaly detected!", severity="warning")
```

## MLOps Maturity Levels

| Level | Description | Practices |
|-------|-------------|-----------|
| **0 — Manual** | Scripts on laptops | Ad-hoc deployment |
| **1 — Basic** | Version control, basic CI | Unit tests, manual eval |
| **2 — Automated** | Automated pipelines | Eval gates, canary deploys |
| **3 — Advanced** | Continuous training | Online learning, auto-rollback |
| **4 — Platform** | Self-service ML | Feature store, A/B infra, chaos testing |

Start at Level 1. Reach Level 2 before scaling users. Level 3+ for mature products.
