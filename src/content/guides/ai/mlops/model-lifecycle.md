For teams that train or fine-tune their own models, this is the process that tracks every version — what it scored, where it is deployed, and when it is retired.

## The Model Lifecycle

```
Research / Experimentation
        ↓
Training & Evaluation
        ↓
Model Registry (versioned)
        ↓
Staging → Canary → Production
        ↓
Production Monitoring
        ↓
(drift or schedule)
        ↓
Retraining / Replacement
        ↓
Deprecation & Archival
```

## Experiment Tracking

```python
import mlflow

def train_model(config: dict):
    with mlflow.start_run():
        # Log configuration
        mlflow.log_params(config)

        # Train
        model = train(config)

        # Log metrics
        metrics = evaluate(model, test_set)
        mlflow.log_metrics(metrics)

        # Save model with metadata
        mlflow.log_model(model, "model", registered_model_name="rag_retriever")

        print(f"Run ID: {mlflow.active_run().info.run_id}")
        print(f"Accuracy: {metrics['accuracy']:.4f}")
```

## Model Registry

A model registry tracks all versions, their status, and deployment history.

```python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class ModelVersion:
    version: str
    model_path: str
    metrics: dict
    status: str   # "staging", "production", "archived"
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    tags: dict = field(default_factory=dict)

class ModelRegistry:
    def __init__(self, registry_path: str):
        self.registry_path = registry_path
        self.models = self._load()

    def register(self, name: str, version: ModelVersion):
        if name not in self.models:
            self.models[name] = {}
        self.models[name][version.version] = asdict(version)
        self._save()

    def promote(self, name: str, version: str, to_status: str):
        """Move a model through staging → production → archived."""
        self.models[name][version]["status"] = to_status
        self._save()

    def get_production(self, name: str) -> ModelVersion:
        versions = self.models.get(name, {})
        prod = [v for v in versions.values() if v["status"] == "production"]
        return ModelVersion(**prod[-1]) if prod else None
```

## Automated Retraining

```python
def should_retrain(current_metrics: dict, baseline_metrics: dict, drift_detected: bool) -> bool:
    """Decide if retraining is needed."""
    quality_dropped = (baseline_metrics["accuracy"] - current_metrics["accuracy"]) > 0.05
    scheduled = datetime.now().month != last_training_month()
    return quality_dropped or drift_detected or scheduled

def retrain_pipeline():
    """Full automated retraining workflow."""
    # 1. Collect fresh data
    new_data = collect_recent_data(days=90)
    validated = validate_data_quality(new_data)

    # 2. Train
    new_model = train(validated)
    new_metrics = evaluate(new_model, holdout_set)

    # 3. Compare to production
    prod_metrics = evaluate(production_model, holdout_set)
    if new_metrics["accuracy"] > prod_metrics["accuracy"]:
        # 4. Register and deploy
        registry.register("rag_model", ModelVersion(
            version=generate_version(),
            metrics=new_metrics,
            status="staging"
        ))
        deploy_canary(new_model)
    else:
        log_warning(f"Retrained model not better: {new_metrics} vs {prod_metrics}")
```

## Versioning Strategy

```
Model: rag_retriever_v2.3.1
         │       │  │  │
         │       │  │  └── Patch: bug fix, config change
         │       │  └───── Minor: new capability, backward compatible
         │       └──────── Major: breaking change, architecture update
         └──────────────── Name: identifies the model type
```

## Model Deprecation

```python
# Deprecation checklist
def deprecate_model(model_name: str, version: str, replacement: str):
    registry.add_deprecation_notice(
        model=model_name,
        version=version,
        message=f"Deprecated. Use {replacement} instead.",
        sunset_date=datetime.now() + timedelta(days=90)
    )
    # Archive after sunset date
    # Never delete — keep for reproducibility and audit
```
