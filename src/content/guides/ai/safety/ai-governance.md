AI governance is how an organization makes decisions about AI, accounts for those decisions, and responds when something goes wrong. For enterprise deployment it is usually a precondition for a sale, not just a compliance checkbox.

## What AI Governance Means in Practice

Governance is concrete documentation and process, not abstract principles:

- **What**: Which AI systems are deployed, doing what, trained on what
- **Who**: Who authorized each system, who owns it, who can modify it
- **How**: How the system makes decisions, what it can and can't do
- **When**: How long data is retained, when the system is retrained, when it's retired
- **What if**: What happens when the system fails, who gets notified, how it's fixed

## Audit Logging Requirements

Every AI-assisted decision that affects a user should be logged with enough information to reconstruct what happened:

```python
import json
import hashlib
from datetime import datetime, UTC
from dataclasses import dataclass, asdict

@dataclass
class AIInteractionLog:
    log_id: str
    timestamp: str
    user_id_hash: str          # hash, not plaintext — PII protection
    session_id: str
    model_id: str
    system_prompt_hash: str    # hash for comparison; store full prompt separately
    user_input_hash: str       # hash of input
    response_hash: str         # hash of response
    input_tokens: int
    output_tokens: int
    latency_ms: int
    guardrails_triggered: list[str]
    final_action: str          # "responded" | "blocked" | "escalated"

def log_interaction(
    user_id: str,
    session_id: str,
    model_id: str,
    system_prompt: str,
    user_input: str,
    response: str,
    latency_ms: int,
    guardrails_triggered: list[str],
    final_action: str,
) -> AIInteractionLog:
    def sha256(text: str) -> str:
        return hashlib.sha256(text.encode()).hexdigest()[:16]

    log = AIInteractionLog(
        log_id=generate_unique_id(),
        timestamp=datetime.now(UTC).isoformat(),
        user_id_hash=sha256(user_id),
        session_id=session_id,
        model_id=model_id,
        system_prompt_hash=sha256(system_prompt),
        user_input_hash=sha256(user_input),
        response_hash=sha256(response),
        input_tokens=count_tokens(system_prompt + user_input),
        output_tokens=count_tokens(response),
        latency_ms=latency_ms,
        guardrails_triggered=guardrails_triggered,
        final_action=final_action,
    )

    # Write to immutable log store
    audit_log.write(json.dumps(asdict(log)))
    return log
```

## Model Cards

A model card documents what a model does, what it can't do, and how it should be used. For deployed AI systems, every model (including fine-tuned models and third-party models you integrate) should have a card:

**Key fields:**
- **Model name and version**: Exact model ID and deployment date
- **Intended use**: What the model is designed to do
- **Out-of-scope uses**: What the model should not be used for
- **Known limitations**: Failure modes, biases, performance degradation conditions
- **Evaluation results**: Performance on relevant benchmarks
- **Training data**: What the model was trained on (as much as is known)
- **Guardrails in place**: What safety measures surround this model
- **Owner**: Who is responsible for this deployment

## Incident Response

When a safety failure occurs in production, you need a documented response process:

```
Incident Severity:
  P0: Active harm, data breach, or regulatory violation — respond immediately
  P1: Significant failure affecting many users — respond within hours
  P2: Isolated failure, no ongoing harm — respond within 24 hours

Response Steps:
  1. Detect: monitoring alert, user report, or internal discovery
  2. Contain: disable the affected feature or add additional guardrails immediately
  3. Assess: determine scope (how many users, how long, what data)
  4. Notify: legal, leadership, and affected users per your notification policy
  5. Remediate: fix the underlying cause
  6. Post-mortem: document what happened, why, and what prevents recurrence
```

## Compliance Considerations

| Regulation | Key AI Requirement |
|------------|-------------------|
| **EU AI Act** | Risk-tier classification; high-risk AI requires conformity assessment, human oversight, logging |
| **GDPR Article 22** | Automated decisions with significant effects require human review and explanation |
| **CCPA** | Right to know what data is used; opt-out of "sale" of personal information |
| **SOC 2 Type II** | Evidence of access controls, monitoring, and incident response |
| **HIPAA** | PHI in AI systems requires Business Associate Agreement with the LLM provider |

## Minimum Viable Governance Checklist

For a production AI system, confirm you have:

```
Documentation:
  [ ] Model card for every model in production
  [ ] System prompt version history (who changed what, when, why)
  [ ] Incident response playbook
  [ ] Data retention and deletion policy

Technical controls:
  [ ] Audit logging for every AI-assisted decision
  [ ] Access controls: who can modify the system prompt / model config
  [ ] Monitoring: alerts for anomalous behavior patterns
  [ ] Human escalation path for safety failures

Process:
  [ ] Clear owner for every AI system
  [ ] Regular review cycle (quarterly minimum)
  [ ] Red team conducted before major updates
  [ ] User-facing disclosure that AI is involved in decisions
```

For wiring governance requirements into your deployment pipeline, see [Security & Compliance](/guides/security-compliance).
