A CI/CD pipeline for an AI system has to test more than code — it has to catch behaviour, data, latency, and cost regressions before they ship.

## Why AI CI/CD Is Different

Traditional CI/CD tests code. AI CI/CD must also test:
- **Model behavior** — does it still answer correctly?
- **Data quality** — is the training/indexing data valid?
- **Performance regression** — is it slower than before?
- **Cost regression** — is it more expensive than expected?

## The AI CI/CD Pipeline

```
Code Push
    ↓
Lint & Unit Tests
    ↓
Data Validation
    ↓
Model/RAG Evaluation (offline)
    ↓
Performance & Cost Benchmarks
    ↓
Integration Tests
    ↓
Deploy to Staging
    ↓
Staging Validation (holdout eval)
    ↓
Canary Deploy (5%)
    ↓
Live Monitoring Gates
    ↓
Full Rollout
```

## GitHub Actions Example

```yaml
# .github/workflows/ai-pipeline.yml
name: AI System CI/CD

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test-and-evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Lint
        run: flake8 src/

      - name: Unit tests
        run: pytest tests/unit/ -v

      - name: Data validation
        run: python scripts/validate_data.py --data-dir data/
        env:
          DATA_PATH: data/knowledge_base/

      - name: Evaluate RAG quality
        run: python scripts/evaluate.py --eval-set tests/eval_data.json
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Check quality gates
        run: python scripts/check_gates.py --results eval_results/latest.json
        # Fails the build if faithfulness < 0.90 or latency p95 > 3s

      - name: Deploy to staging
        if: github.ref == 'refs/heads/main'
        run: ./scripts/deploy.sh staging
```

## Automated Data Validation

```python
import json, os

def validate_knowledge_base(data_dir: str) -> dict:
    """Validate knowledge base before indexing."""
    issues = []

    for filename in os.listdir(data_dir):
        filepath = os.path.join(data_dir, filename)

        # Check file size
        size_mb = os.path.getsize(filepath) / (1024 * 1024)
        if size_mb > 50:
            issues.append(f"{filename}: file too large ({size_mb:.1f}MB)")

        # Check content quality
        with open(filepath) as f:
            content = f.read()

        if len(content) < 100:
            issues.append(f"{filename}: content too short")

        if not any(c.isalpha() for c in content):
            issues.append(f"{filename}: no readable text")

    return {
        "valid": len(issues) == 0,
        "file_count": len(os.listdir(data_dir)),
        "issues": issues
    }
```

## Quality Gates

The offline eval that feeds these gates is covered in [Evaluation Workflow](/guides/evaluation-workflow); here it runs as a build step that fails the pipeline.

```python
QUALITY_GATES = {
    "faithfulness": 0.90,      # Deploy blocker
    "answer_relevancy": 0.80,  # Deploy blocker
    "p95_latency_ms": 3000,    # Deploy blocker
    "cost_per_query": 0.05,    # Warning only
}

def check_gates(results_file: str) -> bool:
    with open(results_file) as f:
        results = json.load(f)

    all_passed = True
    for gate, threshold in QUALITY_GATES.items():
        value = results["metrics"].get(gate, 0)
        passed = value >= threshold

        status = "✓" if passed else "✗"
        print(f"{status} {gate}: {value:.3f} (threshold: {threshold})")

        if not passed:
            all_passed = False

    return all_passed

if __name__ == "__main__":
    import sys
    passed = check_gates(sys.argv[1])
    sys.exit(0 if passed else 1)   # Fail CI if gates not met
```

## Automated Rollback

```python
class AutoRollback:
    def __init__(self, error_threshold: float = 0.05, window_minutes: int = 5):
        self.error_threshold = error_threshold
        self.window = window_minutes

    def should_rollback(self, recent_metrics: dict) -> bool:
        error_rate = recent_metrics.get("error_rate", 0)
        latency_spike = recent_metrics.get("p95_latency_ms", 0) > 5000
        quality_drop = recent_metrics.get("faithfulness", 1.0) < 0.70

        return error_rate > self.error_threshold or latency_spike or quality_drop

    def execute_rollback(self, previous_version: str):
        print(f"🚨 Auto-rollback triggered → reverting to {previous_version}")
        # Trigger deployment of previous version
        deploy(previous_version)
        # Alert team
        alert("Production rollback executed", severity="critical")
```

## Best Practices

| Practice | Why |
|----------|-----|
| Separate eval from unit tests | Different tools, different cadence |
| Gate on multiple metrics | Single metric misses failures |
| Store all eval results | Track trends, detect regressions |
| Automate data validation | Bad data causes silent model failures |
| Always have rollback ready | Fast recovery is better than slow prevention |
