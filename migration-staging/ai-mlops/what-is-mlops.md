## What is MLOps?

MLOps (Machine Learning Operations) is the practice of reliably deploying, monitoring, and maintaining AI systems in production. It bridges the gap between "works on my machine" and "works for a million users."

## Why MLOps Matters

AI systems fail in ways traditional software doesn't:
- Model outputs are **non-deterministic** — the same input can produce different outputs
- Performance **drifts over time** as data distributions change
- Failures are **silent** — wrong answers often look like correct ones
- Evaluation requires **domain expertise**, not just error logs

A system without MLOps practices will degrade silently until users complain.

## Core Practices

```
Traditional Software MLOps          AI/ML MLOps
────────────────────────            ────────────
Unit tests                          Unit tests + behavior tests
Code versioning                     Code + model + data versioning
Deploy code                         Deploy code + model + index
Monitor errors                      Monitor quality + drift + cost
Fix bugs                            Retrain + re-evaluate + redeploy
```

## The MLOps Stack

```
CI/CD Pipeline
    ↓
Model Registry (versioned models)
    ↓
Deployment (canary, blue-green, A/B)
    ↓
Monitoring (latency, quality, cost)
    ↓
Alerting → Rollback or Retrain
```

## Maturity Levels

| Level | Description |
|-------|-------------|
| **0 — Manual** | Scripts on laptops, manual deployments |
| **1 — Basic** | Version control, basic CI/CD |
| **2 — Automated** | Eval gates, canary deploys, monitoring |
| **3 — Advanced** | Continuous training, auto-rollback, online learning |

**Start at Level 1. Reach Level 2 before scaling users.** Most production systems only need Level 2. Level 3 is for mature products with dedicated ML engineering teams.

## Key Principles

1. **Version everything** — code, models, data, prompts
2. **Evaluate before deploying** — quality gates block bad models from reaching users
3. **Monitor continuously** — production data reveals problems dev data doesn't
4. **Test models like code** — unit tests, integration tests, behavioral tests
5. **Document experiments** — track what you tried and why
